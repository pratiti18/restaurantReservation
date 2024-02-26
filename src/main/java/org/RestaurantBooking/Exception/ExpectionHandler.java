package org.RestaurantBooking.Exception;


import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.TimeoutException;

import org.RestaurantBooking.Controllers.userController;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;


@RestControllerAdvice
class   ExpectionHandler {
	
	
	Logger logger=LoggerFactory.getLogger(userController.class);
	
	@ExceptionHandler(InterruptedException.class)
	public ResponseEntity<Map<String, String>> handleInterruptedException(InterruptedException ex) {
	    Map<String, String> errors = new HashMap<>();
	    errors.put("error", "Thread interrupted");
	    logger.warn("InterruptedException -> " + errors);
	    Thread.currentThread().interrupt(); // Reset the interrupted status
	    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errors);
	}

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<String> handleIllegalArgException(IllegalArgumentException er) {
        return ResponseEntity.badRequest().body(er.getMessage());
    }
    
    @ExceptionHandler(TimeoutException.class)
    public ResponseEntity<Map<String, String>> handleTimeoutException(TimeoutException ex) {
        Map<String, String> errors = new HashMap<>();
        errors.put("error", "Operation timed out");
        logger.warn("TimeoutException -> " + errors);
        return ResponseEntity.status(HttpStatus.REQUEST_TIMEOUT).body(errors);
    }
    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<Map<String, String>> handleHttpMessageNotReadableException(HttpMessageNotReadableException ex) {
        Map<String, String> errors = new HashMap<>();
        errors.put("error", "Request message not readable");
        logger.warn("HttpMessageNotReadableException -> " + errors);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errors);
    }
}
