import SockJS from 'sockjs-client';
import {CompatClient, Stomp} from "@stomp/stompjs";
import {Message} from "stompjs";
import {BeginResponse, EndResponse, MoveResponse, OmitResponse} from "../model/ChessResponse";

const API_DOMAIN = "http://localhost:8080"

export interface MoveRequest {
    gameId: string
    color: string
    from: number
    fen: string
    moveFrom: string
    moveTo: string
    promotion?: string
    result?: string
}

export interface EndRequest {
    gameId: string
    color: string
    from: number
    result: string
    fen: string
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
                this.onSeekEnd?.(json as BeginResponse)
                this.onSeekEnd = undefined
                break
            case "CANCEL_SEARCH":
                this.onSearchCancelled?.()
                this.onSearchCancelled = undefined
                break
            case "OMIT":
                this.onGameOmitted?.((json as OmitResponse).error)
                this.onGameEnd()
                break
            case "MOVE":
                this.onMove?.(json as MoveResponse)
                break
            case "END":
                this.onEnd?.(json as EndResponse)
                this.onGameEnd()
                break
        }
    }

    private onSeekEnd: ((response: BeginResponse) => void) | undefined
    private onSearchCancelled: (() => void) | undefined
    private onGameOmitted: ((error: string) => void) | undefined
    private onMove: ((response: MoveResponse) => void) | undefined
    private onEnd: ((response: EndResponse) => void) | undefined

    seek(id: number, onSeekEnd?: (response: BeginResponse) => void,
         onSearchCancelled?: () => void, onOmit?: (error: string) => void,
         onMove?: (response: MoveResponse) => void, onEnd?: (response: EndResponse) => void,
         ) {
        if (this.client !== undefined) {
            this.onSeekEnd = onSeekEnd
            this.onSearchCancelled = onSearchCancelled
            this.onGameOmitted = onOmit
            this.onMove = onMove
            this.onEnd = onEnd
            this.client.send(
                "/chess/game", {}, JSON.stringify(
                    {
                        action: "SEEK", from: id
                    }
                )
            )
        }
    }

    move(request: MoveRequest) {
        this.client?.send(
            "/chess/game", {}, JSON.stringify({
                action: "MOVE",
                gameId: request.gameId,
                color: request.color,
                from: request.from,
                fen: request.fen,
                moveFrom: request.moveFrom,
                moveTo: request.moveTo,
                promotion: request.promotion,
            })
        )
    }

    claimEnd(request: EndRequest) {
        this.client?.send(
            "/chess/game", {}, JSON.stringify({
                action: "END",
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
        this.onGameOmitted = undefined
        this.onMove = undefined
        this.onEnd = undefined
    }
}