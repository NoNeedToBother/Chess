import SockJS from 'sockjs-client';
import { CompatClient, Stomp } from "@stomp/stompjs";
import { Message } from "stompjs";
import { BeginResponse, ConcedeResponse, EndResponse, MoveResponse, TimeResponse } from "../model/ChessResponse";

const API_DOMAIN = "http://localhost:8080"

export interface MoveRequest {
    gameId: string
    color: string
    fromUser: number
    from: string
    to: string
    promotion?: string
}

export interface ConcedeRequest {
    gameId: string
    from: number
    reason: string
}

export interface GameHandler {
    onSeekEnd?: (response: BeginResponse) => void
    onSeekCancel?: () => void
    onOmit?: (error: string) => void
    onMove?: (response: MoveResponse) => void
    onEnd?: (response: EndResponse) => void
    onConcede?: (response: ConcedeResponse) => void
    updateTime?: (response: TimeResponse) => void
}

export class ChessService {
    private socket: WebSocket | undefined
    private client: CompatClient | undefined

    connect(id: number) {
        this.socket = new SockJS(API_DOMAIN + "/chess-websocket")
        this.client = Stomp.over(this.socket)
        this.client.activate()
        this.client.debug = () => {}
        this.client.onConnect = () => {
            this.subscribe(id)
        }
    }

    private subscribe(id: number) {
        this.client?.subscribe(
            "/user/" + id + "/queue/messages",
            (message: Message) => {
                this.onChessResponseReceived(message.body)
            }
        )
    }

    private onChessResponseReceived(response: string) {
        const json = JSON.parse(response)
        switch (json.action) {
            case "BEGIN":
                this.gameHandler?.onSeekEnd?.(json)
                break
            case "CANCEL_SEARCH":
                this.gameHandler?.onSeekCancel?.()
                this.onGameEnd()
                break
            case "MOVE":
                this.gameHandler?.onMove?.(json)
                break
            case "END":
                this.gameHandler?.onEnd?.(json)
                this.onGameEnd()
                break
            case "CONCEDE":
                this.gameHandler?.onConcede?.(json)
                this.onGameEnd()
                break
            case "TIME":
                this.gameHandler?.updateTime?.(json)
                break
        }
    }

    private gameHandler: GameHandler | undefined

    seek(id: number, gameHandler: GameHandler) {
        if (this.client !== undefined) {
            this.gameHandler = gameHandler
            this.client.publish({
                destination: "/chess/game/seek",
                body: JSON.stringify(
                    {
                        from: id
                    })
            })
        }
    }

    cancelSeek(id: number) {
        if (this.client !== undefined) {
            this.client.publish({
                destination: "/chess/game/seek/cancel",
                body: JSON.stringify(
                    {
                        from: id
                    }
                )
            })
        }
    }

    move(request: MoveRequest) {
        this.client?.publish({
            destination: "/chess/game/move",
            body: JSON.stringify({
                gameId: request.gameId,
                color: request.color,
                fromUser: request.fromUser,
                from: request.from,
                to: request.to,
                promotion: request.promotion,
            })
        })
    }

    concede(request: ConcedeRequest) {
        if (this.client !== undefined) {
            this.client.publish({
                destination: "/chess/game/concede",
                body: JSON.stringify({
                    gameId: request.gameId,
                    from: request.from,
                    reason: request.reason,
                })
            })
        }
    }

    disconnect() {
        this.client?.disconnect()
    }

    private onGameEnd() {
        this.gameHandler = undefined
    }
}