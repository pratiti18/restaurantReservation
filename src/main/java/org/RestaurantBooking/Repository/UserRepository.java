package org.RestaurantBooking.Repository;

import java.util.List;

import org.RestaurantBooking.Models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User,Long>{
	
	public User findByEmail(String email);
	
	public List<User> findByActiveAcceptanceTrue();
	

}
