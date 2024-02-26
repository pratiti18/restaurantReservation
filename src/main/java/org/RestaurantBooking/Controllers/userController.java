package org.RestaurantBooking.Controllers;

import java.util.Collections;
import java.util.Comparator;
import java.util.List;

import org.RestaurantBooking.Models.User;
import org.RestaurantBooking.Repository.UserRepository;
import org.RestaurantBooking.Services.userService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/users")
@CrossOrigin
public class userController {

	@Autowired
	public userService userservice;

	@Autowired
	public UserRepository userRepository;

	Logger logger = LoggerFactory.getLogger(userController.class);

	
	@PostMapping("/signUp")
	public Object userSignUp(@RequestBody User user) {
		User existingUser = userRepository.findByEmail(user.getEmail());
		if (existingUser != null)
			return new Object[] { "false", "Email already exists", null };
		return userservice.userSignUp(user);
	}


	@PostMapping("/booking")
	public Object userBooking(@RequestParam String email, @RequestParam String password) throws InterruptedException {
		logger.info("Hit successful");
		Thread.sleep(500);
		User user = userRepository.findByEmail(email);
		if (user == null) {
			logger.error("User does not exist");
			return new Object[] { "false", "User does not exist" };
		}
		return userservice.userBooking(email, password);
	}

	@PostMapping("/startTasks")
	public User initiatestartTasks(@RequestParam String email) throws InterruptedException {
		logger.info("Tasks Started");
		User user = userRepository.findByEmail(email);
		return userservice.startTasks(user);
	}

	@GetMapping("/findAll")
	public String findAll() {
		List<User> users = userservice.findAllUsers();
		Collections.sort(users, Comparator.comparing(User::getId));
		return users.get(0).getEmail();
	}

	@PostMapping("/checkAvailability")
	public boolean checkAvailability(@RequestParam String email) throws InterruptedException {
		User user = userRepository.findByEmail(email);
		logger.info("Checking availability of seats");
		return userservice.CheckAvailability(user);
	}
	
	@GetMapping("/ifOvensAvailable")
	public boolean allOvensBusy() {
		return userservice.allOvensBusy();
	}

	@PostMapping("/saveUserUpdates")
	public User saveUserUpdates(@RequestParam String email) {
		User user = userRepository.findByEmail(email);
		user.setActiveAcceptance(false);
		user.setBooking(false);
		user.setQuantity(0);
		user.setPizzaCounters(null);
		userRepository.save(user);
		return user;
	}


	@PostMapping("/orderNow")
	public User userOrderNow(@RequestParam String email, @RequestParam int quantity,
			@RequestParam String pizzaCounters) {
		User user = userRepository.findByEmail(email);
		return userservice.orderNow(user, quantity, pizzaCounters);
	}
	
	@PostMapping("/ifUserIsNext")
	public Object ifUserIsNext(@RequestParam String email) {
		User user = userRepository.findByEmail(email);
		return userservice.ifUserIsNext(user);

	}

	
	@PostMapping("/numberOfPeopleInQueue")
	public int numberOfPeopleInQueue(@RequestParam String email) {
		User user = userRepository.findByEmail(email);
		int k = userservice.numberOfPeopleInQueue(user) + 1;
		return k;
	}

	@PostMapping("/ifAllBaked")
	public boolean ifAllBaked(@RequestParam String email) {
		User user = userRepository.findByEmail(email);
		return userservice.ifAllBaked(user);
	}

	@PostMapping("/cancelOrder")
	public User cancelOrder(@RequestParam String email) {
		User user = userRepository.findByEmail(email);
		return userservice.cancelOrder(user);
	}
}
