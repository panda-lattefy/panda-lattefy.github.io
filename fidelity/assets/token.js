// Panda Bar - Fidelity Card | Auth

async function loginAuth() {

  loader.style.display = "block"

  const accessToken = localStorage.getItem('accessToken')

  if (accessToken) {
    try {
      // Validate token
      const response = await fetch(`${apiUrl}/auth/verify-token`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        }
      })

      if (response.ok) {

        const userData = await response.json()
        console.log('Token valid. User logged in:', userData)
        window.location.href = `./index.html?phoneNumber=${userData.phoneNumber}`

      } else {

        console.log('Invalid token, clearing localStorage.')
        //localStorage.removeItem('accessToken')
        loader.style.display = "none" 

      }

    } catch (error) {
      console.error('Error validating token:', error)
      localStorage.removeItem('accessToken')
      loader.style.display = "none" 
    }
    
  } else {
    console.log('No token found. Please log in.')
    loader.style.display = "none" 
  }

}

async function cardAuth() {

  const phoneNumber = getPhoneNumberFromURL()
  const accessToken = localStorage.getItem('accessToken')

  let client
  if (phoneNumber) {
    client = await getClientByPhoneNumber(phoneNumber)
  } else if (accessToken){
    client = await getClientByToken() 
  } else {
    window.location.href = './path.html'
  }

  return client
}