const signUpForm = document.getElementById("sign-up-form");

signUpForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const userID = document.getElementById("user-id");
  const password = document.getElementById("passwrd");
  const fullName = document.getElementById("full-name");
  const phone = document.getElementById("phone-number");

  const formData = {
    userID: userID.value,
    password: password.value,
    name: fullName.value,
    phone: phone.value,
  };

  try {
    const res = await fetch("http://localhost:5000/api/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });
    if (res.status === 200) {
        //Just for viewing results
    //   console.log(res);
      const ans = await res.json();
    //   console.log(ans);
        alert(`${ans.name} Sucessfully registered`)
      setTimeout(()=>{
        window.open('http://localhost:4000', '_self')
      },2000)
     
    } else{
        alert(`Response Status ${res.status}\n ${res.statusText}`)
    }
  } catch (error) {
    console.log("Error", error);
  }
});
