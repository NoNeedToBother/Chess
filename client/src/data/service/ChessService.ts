import SockJS from 'sockjs-client';
import {CompatClient, Stomp} from "@stomp/stompjs";
import {Message} from "stompjs";
import {BeginResponse, EndResponse, MoveResponse} from "../model/ChessResponse";

const API_DOMAIN = "http://localhost:8080"

export interface MoveRequest {
    gameId: string
    color: string
    from: number
    fen: string
    promotion?: string
}

export interface EndRequest {
    gameId: string
    color: string
    from: number
    result: string
    fen: string
}

export interface GameHandler {
    onSeekEnd?: (response: BeginResponse) => void
    onSearchCancelled?: () => void
    onOmit?: (error: string) => void
    onMove?: (response: MoveResponse) => void
    onEnd?: (response: EndResponse) => void
}

export class ChessService {
    private socket: WebSocket | undefined
    private client: CompatClient | undefined

    connect(id: number) {
        this.socket = new SockJS(API_DOMAIN + "/chess-websocket")
        this.client = Stomp.over(this.socket)
        this.client.connect({}, () => {
            this.subscribe(id)
        })
    }

    private subscribe(id: number) {
        this.client?.subscribe(
            "/user/" + id + "/queue/messages",
            (message: Message) => {
                this.onChessResponseReceived(message.body)
            }
        );
    }

    private onChessResponseReceived(response: string) {
        let json = JSON.parse(response)
        switch (json.action) {
            case "BEGIN":
                this.gameHandler?.onSeekEnd?.(json)
                break
            case "CANCEL_SEARCH":
                this.gameHandler?.onSearchCancelled?.()
                this.onGameEnd()
                break
            case "OMIT":
                this.gameHandler?.onOmit?.(json.error)
                this.onGameEnd()
                break
            case "MOVE":
                this.gameHandler?.onMove?.(json)
                break
            case "END":
                this.gameHandler?.onEnd?.(json)
                this.onGameEnd()
                break
        }
    }

    private gameHandler: GameHandler | undefined

    seek(id: number, gameHandler: GameHandler) {
        if (this.client !== undefined) {
            this.gameHandler = gameHandler
            this.client.send(
                "/chess/game/seek", {}, JSON.stringify(
                    {
                        from: id
                    }
                )
            )
        }
    }

    move(request: MoveRequest) {
        this.client?.send(
            "/chess/game/move", {}, JSON.stringify({
                gameId: request.gameId,
                color: request.color,
                from: request.from,
                fen: request.fen,
                promotion: request.promotion,
            })
        )
    }

    claimEnd(request: EndRequest) {
        this.client?.send(
            "/chess/game/end", {}, JSON.stringify({
                gameId: request.gameId,
                from: request.from,
                fen: request.fen,
                result: request.result
            })
        )
    }

    disconnect() {
        this.client?.disconnect()
    }

    private onGameEnd() {
        this.gameHandler = undefined
    }
}