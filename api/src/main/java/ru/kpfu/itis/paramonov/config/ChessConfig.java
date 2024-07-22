package ru.kpfu.itis.paramonov.config;

import lombok.RequiredArgsConstructor;
import org.jetbrains.annotations.NotNull;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketTransportRegistration;
import org.springframework.web.socket.handler.WebSocketHandlerDecorator;
import org.springframework.web.socket.handler.WebSocketHandlerDecoratorFactory;
import ru.kpfu.itis.paramonov.utils.chess.ChessGameStore;

@Configuration
@EnableWebSocketMessageBroker
@RequiredArgsConstructor
public class ChessConfig implements WebSocketMessageBrokerConfigurer {

    private final ChessGameStore chessGameStore;

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/chess-websocket")
                .setAllowedOrigins("http://localhost:3000")
                .withSockJS()
                .setDisconnectDelay(300 * 1000);
    }

    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        registry.setApplicationDestinationPrefixes("/chess");
        registry.setUserDestinationPrefix("/user");
        registry.enableSimpleBroker("/topic", "/user");
    }

    @Override
    public void configureWebSocketTransport(WebSocketTransportRegistration registry) {
        registry.addDecoratorFactory(new WebSocketHandlerDecoratorFactory() {
            @NotNull
            @Override
            public WebSocketHandler decorate(@NotNull WebSocketHandler handler) {
                return new WebSocketHandlerDecorator(handler) {
                    @Override
                    public void afterConnectionClosed(@NotNull WebSocketSession session,
                                                      @NotNull CloseStatus closeStatus) throws Exception {
                        Integer id = (Integer) session.getAttributes().get("id");
                        chessGameStore.notifyPlayerDisconnected(id);
                        super.afterConnectionClosed(session, closeStatus);
                    }
                };
            }
        });
    }
}
