const logInForm = document.getElementById('login-form')

logInForm.addEventListener('submit',async (e)=>{
    e.preventDefault()
    const userID = document.getElementById('user-id')
    const password = document.getElementById('passwrd')
    const user = {
        userID: userID.value,
        password : password.value
    }
    const res = await fetch('http://localhost:4000/auth/login',{
        method:'POST',
        headers:{
            'Content-type':'application/json'
        },
        body:JSON.stringify(user)
    })
   if(res.status===200){
       const ans = await res.json()
       console.log(ans)
        window.open('http://localhost:7000/?jwt='+ans.jwtToken)
   } else{
       console.log(`Response: ${res.status}`)
   }
})