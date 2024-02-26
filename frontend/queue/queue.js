const bookingResponse = sessionStorage.getItem('bookingResponse');
const parsedResponse = JSON.parse(bookingResponse);
console.log(parsedResponse);

function countDownTimer(minutes) {
    const second = 1000,
          minute = second * 60,
          hour = minute * 60;

    // Set the initial wait time for the pizza in hours, minutes, and seconds format
    const initialWaitTime = {
      hours: 0,
      minutes: minutes,
      seconds: 0
    };

    const countDown = new Date().getTime() + getMilliseconds(initialWaitTime),
        x = setInterval(function () {
          const now = new Date().getTime(),
                distance = countDown - now;

          document.getElementById("hours").innerText = Math.floor(distance / hour),
          document.getElementById("minutes").innerText = Math.floor((distance % hour) / minute),
          document.getElementById("seconds").innerText = Math.floor((distance % minute) / second);

          // do something later when time is reached
          if (distance < 0) {
            document.getElementById("headline").innerText = "Your wait is over!!!";
            document.getElementById("countdown").style.display = "none";
            document.getElementById("content").style.display = "block";
            clearInterval(x);
          }
        }, 0);

    // Helper function to convert hours, minutes, and seconds to milliseconds
    function getMilliseconds(time) {
      return time.hours * hour + time.minutes * minute + time.seconds * second;
    }
  };

  const facts = [
    {
      title:'As we love you,',
      fact: 'Did you checkout the H&M store outside? Heard of some exciting price drops.',
      link: 'https://ctt.ec/eP43_',
      color: '#82E042' ,
      newcolor:'#5cb71e'
    },
    {
      title:'Did you know?',
      fact: 'The word “Pizza” was first documented around 997 AD in Gaeta, Italy. After that the name started to spread to different parts of central and southern Italy.',
      link: 'https://ctt.ec/d7Ms5',
      color: '#e1e100',
      newcolor:'#959500'
    },
    {
        title:'Did you know?',
      fact: 'The biggest pizza in recorded history was prepared by Dovilio Nardi, Andrea Mannocchi, Marco Nardi, Matteo Nardi and Matteo Giannotte in Rome, Italy, on 13 December 2012. It had a total surface area of 13,580.28 ft².', 
      link: 'https://ctt.ec/7L3Do',
      color: '#BADA55',
      newcolor:'#97ba28'
    },
    {
        title:'As we love you,',
      fact: 'You know,if our chemistry were a pizza, it would be the most delightful Diwali treat.!', 
      link: 'https://ctt.ec/ha529',
      color: '#59CACC',
      newcolor:'#39b7b9'
    },
    {
        title:'Did you know?',
      fact: 'There’s a pizza museum in Philadelphia Pizza Brain is home to the world’s largest collection of pizza memorabilia.', 
      link: 'https://ctt.ec/pKo4e',
      color: '#F187A7',
      newcolor:'#ec5986'
    },
    {
        title:'Did you know?',
      fact: 'In 2001, the Russian Space Agency was paid more than a million bucks to deliver a six-inch pizza to the International Space Station. Russian cosmonaut,Yuri Usachov had the honor of being the first person to receive a pizza delivery while in orbit.', 
      link: 'https://ctt.ec/9Hy59',
      color: '#6B8CF3',
      newcolor:'#3c67ef'
    },
    {
        title:'As we love you,',
      fact: 'Forget the fireworks, meeting you is the real highlight of my Diwali', 
      link: 'https://ctt.ec/fv6L7',
      color: '#facade',
      newcolor:'#f384b2'
    }
  ];
  const body = document.querySelector('body');
  const button = document.querySelector('#button');
  const fact = document.querySelector('#fact');
  const twitter = document.querySelector('#twitter');
  const link = document.querySelector('#link-paragraph');
  
  /*
  Click --> Gets new object from the facts array based on getRandomNumber.
  Takes the property values of that object and applies it to the elements reffered to in const.
  */
function changeFact(){
        let newFact = facts[getRandomNumber()];
        body.style.backgroundColor = newFact["color"];
        // button.style.backgroundColor = newFact["color"];
        fact.style.color = newFact["newcolor"];
        // twitter.style.color = newFact["color"];
        // twitter.href = newFact["link"];  
        button.style.backgroundColor=newFact["color"];      
        title.style.color= newFact["color"]
        title.textContent= newFact["title"]
        fact.textContent = newFact["fact"];
 };

    setInterval(changeFact, 8000);

  //Returns a random number between 0 and and 6 
  function getRandomNumber() {
    return Math.floor(Math.random() * 7);
  }


  async function checkQueueingStatus() {
      let attempts = 0;
      const maxAttempts = 1000; // Set a maximum number of attempts
      const closeBtn= document.getElementById("cancel-button");
      closeBtn.disabled=false;
      const ifUser = await ifUserIsNext();
      console.log(ifUser, "UserNextUp");
      if(ifUser[0] === true)
        {
            const size=ifUser[1];
            console.log(size);
            closeBtn.disabled=true;
            const spanId= document.getElementById("show-status");
            spanId.innerHTML=`are you ready to satisfy those pizza cravings? Because you're next, at the front of the line!`
            countDownTimer(size);
        }else{
                const size = ifUser[1];
                const name = parsedResponse.name;
                console.log(name);
              
                const spanId = document.getElementById("show-status");
                const showUserElement = document.getElementById("show-user");
              
                if (showUserElement) {
                  showUserElement.innerHTML = `${name}`;
                  spanId.innerHTML = ` feel free to soak in the cheezy aroma and anticipation while we make space for you.`;
                  countDownTimer(size);
                } else {
                  console.error("Element with id 'show-user' not found.");
                }
            }

      const intervalId = setInterval(async () => {
          try {
              console.log('Checking queueing status...');
              const url = new URL("http://localhost:8080/users/checkAvailability");
              const params = new URLSearchParams();
              params.append("email", parsedResponse.email); // Ensure parsedResponse is defined

              const response = await fetch(url, {
                  method: 'POST',
                  headers: {
                      'Accept': 'application/json',
                      'Content-Type': 'application/x-www-form-urlencoded'
                  },
                  body: params.toString()
              });

              if (!response.ok) {
                  throw new Error(`HTTP error! Status: ${response.status}`);
              }

              const responseData = await response.json();
              console.log(responseData);
              closeBtn.disabled=false;
              if (responseData === true) {
                  console.log("Trying to access the true block");
                  const pizzaReceiptUrl= "../pizzaReceipt/pizzaReceipt.html";
                  window.location.replace(pizzaReceiptUrl);
                  clearInterval(intervalId);
              }
              else if(responseData === false){
                  // const spanId= document.getElementById("show-status");
                  // spanId.innerHTML=`${responseData[1]}`

                  const ifUserIsNextData = await ifUserIsNext();
                  console.log(ifUserIsNextData, "UserNextDown");
                  if(ifUserIsNextData[0] === true)
                  {
                      closeBtn.disabled=true;
                      const spanId= document.getElementById("show-status");
                      spanId.innerHTML=`are you ready to satisfy those pizza cravings? Because you're next, at the front of the line!`
                  }else{
                            console.log("Down Name")
                            const name = parsedResponse.name;
                            console.log(name);
                        
                            const showUserElement = document.getElementById("show-user");
                            showUserElement.innerHTML = `${name}`;
                            spanId.innerHTML = ` feel free to soak in the cheezy aroma and anticipation while we make space for you.`;
                        }
                  }

            //   // Optionally, store the response data in localStorage if needed
            //   localStorage.setItem('processEndUserResponse', JSON.stringify(responseData));

              attempts++;
              if (attempts >= maxAttempts) {
                  console.log('Maximum attempts reached. Stopping the interval.');
                  clearInterval(intervalId);
              }

          } catch (error) {
            //   alert("Error during fetchooooo:", error);
              // Handle the error appropriately, e.g., inform the user
          }
      }, 2000);
    }


  // Start checking the queueing status at intervals
checkQueueingStatus();


async function ifUserIsNext(){
      try{
          const url = new URL("http://localhost:8080/users/ifUserIsNext");
              const params = new URLSearchParams();
              params.append("email", parsedResponse.email); // Ensure parsedResponse is defined

              const response = await fetch(url, {
                  method: 'POST',
                  headers: {
                      'Accept': 'application/json',
                      'Content-Type': 'application/x-www-form-urlencoded'
                  },
                  body: params.toString()
              });

              const responseData = await response.json();
              console.log(responseData, typeof(responseData));
              return responseData;
      }catch(error){
          console.error("Error: ", error);
      }
}

async function numberOfPeopleInQueue(){
  try{
      const url = new URL("http://localhost:8080/users/numberOfPeopleInQueue");
          const people_params = new URLSearchParams();
          people_params.append("email", parsedResponse.email); // Ensure parsedResponse is defined
          const response = await fetch(url, {
              method: 'POST',
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded'
              },
              body: people_params.toString()
          });

          const responseData = await response.json();
          return responseData;
  }catch(error){
      console.error("Error: ", error);
  }
}


    async function handleCancelOrder(){
        try{
                const url = new URL("http://localhost:8080/users/cancelOrder");
                const cancel_params = new URLSearchParams();
                    cancel_params.append("email", parsedResponse.email); // Ensure parsedResponse is defined

                    const response = await fetch(url, {
                        method: 'POST',
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/x-www-form-urlencoded'
                        },
                        body: cancel_params.toString()
                    });

                    const responseData = await response.json();
                    console.log(responseData, typeof(responseData));
                    setTimeout(()=>{
                        const cancelUrl= "../cancelPage/cancelPage.html";
                        window.location.replace(cancelUrl);
                    }, 2000);
                    return responseData;
            }catch(error){
                console.error("Error: ", error);
            }
    }