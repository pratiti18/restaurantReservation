package org.RestaurantBooking.Services;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;
import java.util.concurrent.ThreadPoolExecutor;

import org.RestaurantBooking.Controllers.userController;
import org.RestaurantBooking.Models.User;
import org.RestaurantBooking.Repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class userServiceImpl implements userService {

	@Autowired
	public UserRepository userRepository;
	private final ExecutorService serviceBaking = Executors.newFixedThreadPool(40);
	private final List<String> waitingQueue = new ArrayList<>();
	ThreadPoolExecutor threadPool = (ThreadPoolExecutor) serviceBaking;
	private final int totalAvailableSeats = 2;
	Logger logger = LoggerFactory.getLogger(userController.class);
	BCryptPasswordEncoder bcrypt = new BCryptPasswordEncoder();

	@Override
	public Object userSignUp(User inputUser) {
		User user = new User();
		String encryptedPassword = bcrypt.encode(inputUser.getPassword());
		user.setName(inputUser.getName());
		user.setEmail(inputUser.getEmail());
		user.setPassword(encryptedPassword);
		user.setBooking(false);
		user.setActiveAcceptance(false);
		user.setQuantity(0);
		userRepository.save(user);
		return new Object[] { "true", "Signed Up Successfully", user };
	}

	@Override
	public Object userBooking(String email, String password) {
		User user = userRepository.findByEmail(email);
		if (user.isActiveAcceptance() || user.isBooking())
			return new Object[] { "false", "Already Logged In" };
		if (bcrypt.matches(password, user.getPassword())) {
			user.setBooking(true);
			userRepository.save(user);
		} else {
			logger.warn("Incorrect Password");
			return new Object[] { "false", "Incorrect Password" };
		}
		return new Object[] { "true", "Login Successful", user };
	}

	/**
	 * Here we are starting the Baking task but submitting the tasks to the Thread Pool
	 */
	@Override

	public User startTasks(User user) throws InterruptedException {
		List<User> list = userRepository.findByActiveAcceptanceTrue();
		if (list.isEmpty() && waitingQueue.isEmpty()) {
			serviceBaking.shutdown();
			logger.info("Job is done************waitingQueue size******" + waitingQueue.size());
		}
		User processDone = null;
		List<Future<User>> futures = new ArrayList<>();
		int i = 1;
		for (i = 1; i <= user.getQuantity(); i++) {
			futures.add(serviceBaking.submit(new TaskServiceBaking(user)));
		}

		try {
			processDone = futures.get(futures.size() - 1).get();
		} catch (InterruptedException e) {
			// TODO Auto-generated catch block
			logger.error("Some error occured while receiving the user whose task is done");
		} catch (ExecutionException e) {
			// TODO Auto-generated catch block
			logger.error("Some error occured while receiving the user whose task is done");
		}
		userRepository.save(processDone);
		return processDone;
	}

	@Override
	public List<User> findAllUsers() {
		List<User> list = userRepository.findAll();
		return list;
	}
	
/**
 * Checking the availability for a particular user
 */
	@Override
	public boolean CheckAvailability(User user) throws InterruptedException {
		List<User> list = userRepository.findByActiveAcceptanceTrue();
		if (userRepository.findByActiveAcceptanceTrue().size() < totalAvailableSeats) {
			User waitingUser = userRepository.findByEmail(waitingQueue.get(0));
			if (user != null && user.isBooking() == true && allOvensBusy() == false) {
				user = userRepository.findByEmail(user.getEmail());
				logger.info("***************WaitingQueue " + user.getName() + " ***************is removed********* ");
				if (waitingUser.equals(user)) {
					user.setActiveAcceptance(true);
					userRepository.save(user);
					waitingQueue.remove(0);
					return true;
				}
			}
		}
		return false;
	}

	/**
	 * Checking if all the threads which in here
	 * we have considered as our ovens are busy or not.
	 */
	@Override
	public boolean allOvensBusy() {
		if (threadPool.getActiveCount() == threadPool.getMaximumPoolSize())
			return true;
		else
			return false;
	}
	
	/**
	 * This is the part where the order for an user is placed. This is also the place where we
	 * are checking if the user has place to be seated in the restaurant or should be in  the queue.
	 */
	@Override
	public User orderNow(User user, int quantity, String pizzaCounters) {
		int size = 0;
		List<User> list = userRepository.findByActiveAcceptanceTrue();
		if (list.size() < totalAvailableSeats && !list.contains(user) && user.isBooking() == true) {
			synchronized (user) {
				user.setActiveAcceptance(true);
				user.setQuantity(quantity);
				user.setPizzaCounters(pizzaCounters);
				userRepository.save(user);
				try {
					Thread.sleep(1000);
				} catch (InterruptedException e) {
					logger.error("Some errors regarding the thread");
				}
				logger.info(user.getName() + " is processing " + userRepository.findByActiveAcceptanceTrue().size());
			}
		} else if (!waitingQueue.contains(user.getEmail())) {
			synchronized (user) {
				user.setQuantity(quantity);
				user.setPizzaCounters(pizzaCounters);
				userRepository.save(user);
				waitingQueue.add(user.getEmail());
				logger.info(user.getName() + "  ****is waiting*****  " + waitingQueue.size());
			}
		}
		return user;
	}

	/**
	 * Checking if a particluar user is on top of the queue.
	 */
	@Override
	public Object ifUserIsNext(User user) {
		if (waitingQueue.isEmpty()) {
			logger.warn("Waiting Queue is empty");
			return false;
		}

		if (waitingQueue.get(0).equals(user.getEmail()))
			return new Object[] { true, 1 };
		else {
			int size = waitingQueue.indexOf(user.getEmail()) + 1;
			return new Object[] { false, size };
		}

	}

	/**
	 * Number of people waiting in the WaitingQueue
	 */
	@Override
	public int numberOfPeopleInQueue(User user) {
		int size = waitingQueue.indexOf(user.getEmail()) + 1;
		return size;
	}
	
    /**
     * Checking if  all the pizzas for a particular user are baked or not.
     */
	@Override
	public boolean ifAllBaked(User user) {
		if (user.getQuantity() == 0)
			return true;
		else
			return false;
	}

	/**
	 * Cancelling the order
	 */
	@Override
	public User cancelOrder(User user) {
		user.setBooking(false);
		user.setPizzaCounters(null);
		user.setQuantity(0);
		userRepository.save(user);
		waitingQueue.remove(user.getEmail());
		return user;
	}
}
