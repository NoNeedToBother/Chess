import SockJS from 'sockjs-client';
import {CompatClient, Stomp} from "@stomp/stompjs";
import {Message} from "stompjs";
import {BeginResponse} from "../model/ChessResponse";

const API_DOMAIN = "http://localhost:8080"

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
        let json = JSON.parse(response) as BeginResponse
        switch (json.action) {
            case "BEGIN":
                this.onSeekEnd?.(json)
                this.onSeekEnd = undefined
                break
        }
    }

    private onSeekEnd: ((response: BeginResponse) => void) | undefined

    seek(id: number, onEnd: (response: BeginResponse) => void) {
        if (this.client !== undefined) {
            this.onSeekEnd = onEnd
            this.client.send(
                "/chess/game", {}, JSON.stringify(
                    {
                        action: "SEEK", from: id
                    }
                )
            )
        }
    }
}