package org.RestaurantBooking.Models;

import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Component
@Scope("protocol")
@Table(name = "users")
public class User {
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Long id;
	private String name;
	private String password;
	@Column(name = "email", unique = true)
	private String email;
	private boolean booking;
	private boolean activeAcceptance;
	private int quantity;
	private String pizzaCounters;

	public User() {
		super();

	}

	public User(Long id, String name, String password, boolean booking, boolean activeAcceptance, String email,
			int quantity, String pizzaCounters) {
		super();
		this.id = id;
		this.name = name;
		this.password = password;
		this.booking = booking;
		this.activeAcceptance = activeAcceptance;
		this.email = email;
		this.quantity = quantity;
		this.pizzaCounters = pizzaCounters;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public boolean isBooking() {
		return booking;
	}

	public void setBooking(boolean booking) {
		this.booking = booking;
	}

	public boolean isActiveAcceptance() {
		return activeAcceptance;
	}

	public void setActiveAcceptance(boolean activeAcceptance) {
		this.activeAcceptance = activeAcceptance;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public int getQuantity() {
		return quantity;
	}

	public void setQuantity(int quantity) {
		this.quantity = quantity;
	}

	public String getPizzaCounters() {
		return pizzaCounters;
	}

	public void setPizzaCounters(String pizzaCounters) {
		this.pizzaCounters = pizzaCounters;
	}

}
