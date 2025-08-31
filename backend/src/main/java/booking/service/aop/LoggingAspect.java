package booking.service.aop;

import java.util.Arrays;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.AfterThrowing;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.springframework.stereotype.Component;

@Aspect
@Component
public class LoggingAspect {
    private static final Logger logger = LogManager.getLogger(LoggingAspect.class);

    @Before(
            "within(booking.service.controller..*) "
                    + "|| within(booking.service.service..*) "
                    + "|| within(booking.service.repository..*)"
    )
    public void logBefore(JoinPoint joinPoint) {
        logger.info(
                "Виклик методу: {} з аргументами: {}",
                joinPoint.getSignature().toShortString(),
                Arrays.toString(joinPoint.getArgs())
        );
    }

    @AfterReturning(
            pointcut = "within(booking.service.controller..*) "
                    + "|| within(booking.service.service..*) "
                    + "|| within(booking.service.repository..*)",
            returning = "result"
    )
    public void logAfterReturning(JoinPoint joinPoint, Object result) {
        logger.info(
                "Метод {} повернув: {}",
                joinPoint.getSignature().toShortString(),
                result
        );
    }

    @AfterThrowing(
            pointcut = "within(booking.service.controller..*) "
                    + "|| within(booking.service.service..*) "
                    + "|| within(booking.service.repository..*)",
            throwing = "ex"
    )
    public void logAfterThrowing(JoinPoint joinPoint, Throwable ex) {
        logger.error(
                "Метод {} кинув виключення: {} - {}",
                joinPoint.getSignature().toShortString(),
                ex.getClass().getSimpleName(),
                ex.getMessage()
        );
    }

    @Around(
            "within(booking.service.controller..*) "
                    + "|| within(booking.service.service..*) "
                    + "|| within(booking.service.repository..*)"
    )
    public Object logExecutionTime(ProceedingJoinPoint joinPoint) throws Throwable {
        long start = System.currentTimeMillis();
        try {
            Object result = joinPoint.proceed();
            long duration = System.currentTimeMillis() - start;
            logger.info(
                    "Метод {} виконувався {} мс",
                    joinPoint.getSignature().toShortString(),
                    duration
            );
            return result;
        } catch (Throwable ex) {
            long duration = System.currentTimeMillis() - start;
            logger.error(
                    "Метод {} завершився з помилкою за {} мс",
                    joinPoint.getSignature().toShortString(),
                    duration
            );
            throw ex;
        }
    }
}
