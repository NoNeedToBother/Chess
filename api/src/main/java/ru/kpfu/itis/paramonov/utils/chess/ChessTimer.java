package ru.kpfu.itis.paramonov.utils.chess;

import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.ScheduledFuture;
import java.util.concurrent.TimeUnit;

public class ChessTimer {

    private final ScheduledExecutorService scheduler;
    private ScheduledFuture<?> future;
    private final Runnable task;
    private final long delay;

    public ChessTimer(Runnable task, long delay) {
        this.task = task;
        this.delay = delay;
        this.scheduler = Executors.newScheduledThreadPool(1);
    }

    public void start() {
        if (future == null || future.isCancelled()) {
            future = scheduler.scheduleAtFixedRate(task, delay, delay, TimeUnit.MILLISECONDS);
        }
    }

    public void stop() {
        if (future != null) {
            future.cancel(false);
        }
    }

    public void resume() {
        start();
    }

    public void shutdown() {
        scheduler.shutdown();
    }

    public boolean isRunning() {
        return future != null && !future.isCancelled() && !future.isDone();
    }
}
