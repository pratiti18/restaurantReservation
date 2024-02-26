package org.RestaurantBooking.Services;

import java.util.List;

import org.RestaurantBooking.Models.User;

public interface userService {
	public Object userSignUp(User user);

	public Object userBooking(String email, String password);

	public User startTasks(User user) throws InterruptedException;

	public List<User> findAllUsers();

	public boolean CheckAvailability(User user) throws InterruptedException;

	public boolean allOvensBusy();

	public User orderNow(User user, int quantity, String pizzaCounters);

	public Object ifUserIsNext(User user);

	public int numberOfPeopleInQueue(User user);

	public boolean ifAllBaked(User user);

	public User cancelOrder(User user);

}
