package org.RestaurantBooking.Services;

import java.util.concurrent.Callable;

import org.RestaurantBooking.Controllers.userController;
import org.RestaurantBooking.Models.User;
import org.RestaurantBooking.Repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class TaskServiceBaking implements Callable<User> {

	private User user;
	
	@Autowired
	public UserRepository userRepository;
	
	Logger logger=LoggerFactory.getLogger(userController.class);
	public TaskServiceBaking() {
		super();
	}


	public TaskServiceBaking(User user) {
		super();
		this.user = user;
	}


	@Override
	public User call() throws Exception {
		// TODO Auto-generated method stub
		logger.info("--------------------Baking started-----"+user.getEmail()+"----"+Thread.currentThread().getName());
		Thread.sleep(8000);
		logger.info("-------------------------Baking done-----"+user.getEmail()+"----"+Thread.currentThread().getName());
		int quantity=user.getQuantity()-1;
		user.setQuantity(quantity);
		return user;
	}
}
