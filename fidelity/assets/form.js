// Panda Bar - Fidelity Card | Form

const apiUrl = 'https://backend-3kmq.onrender.com'

// Fetch client by phone number
async function getClientByPhoneNumber(phoneNumber) {
  try {
    const response = await fetch(`${apiUrl}/clients/${phoneNumber}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
      }
    })

    if (!response.ok) throw new Error('Network response was not ok')
    return await response.json()
  } catch (error) {
    console.error('Error fetching client:', error)
    return null
  }
}

// Authenticate client by phone number and obtain token
async function AuthenticatePhoneNumber(phoneNumber) {
  try {
    const response = await fetch(`${apiUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phoneNumber })
    })

    if (!response.ok) throw new Error('Authentication failed')

    const data = await response.json()
    localStorage.setItem('accessToken', data.accessToken) // Store access token in local storage
    return data
  } catch (error) {
    console.error('Error authenticating phone number:', error)
    return null
  }
}


// Create client
async function createClient(clientData) {
  try {
    const response = await fetch(`${apiUrl}/clients`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
      },
      body: JSON.stringify(clientData)
    })
    const data = await response.json()
    console.log('Client created:', data)
  } catch (error) {
    console.error('Error creating client:', error)
  }
}

// Update client
async function updateClient(phoneNumber, updates) {
  try {
    const response = await fetch(`${apiUrl}/clients/${phoneNumber}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
      },
      body: JSON.stringify(updates)
    })
    const data = await response.json()
    console.log('Client updated:', data)
  } catch (error) {
    console.error('Error updating client:', error)
  }
}

// Send email function
async function sendCardEmail(client) {

  const imageUrl = 'https://res.cloudinary.com/dc4g5ehpo/image/upload/v1732316740/card_xspn9b.png'
  const title = 'Ya podes empezar a sumar panditas!'

  try {
  
      const templateParams = {
          to_email: client.email,
          name: client.name,
          title: title,
          image_url: imageUrl || ''
      }

      const serviceID = 'service_llm5u9s'
      const templateID = 'template_cp5w5vg'

      await emailjs.send(serviceID, templateID, templateParams)

    } 
  catch (error) {
      console.error('Error sending email:', error)
  }
  
}

// URL Functions

function getPhoneNumberFromURL() {
  const urlParams = new URLSearchParams(window.location.search)
  return urlParams.get('phoneNumber')
}

function clearURL() {
  const urlParams = new URLSearchParams(window.location.search)
  urlParams.delete('phoneNumber')
  const newUrl = window.location.pathname + (urlParams.toString() ? `?${urlParams.toString()}` : '')
  window.history.replaceState({}, '', newUrl)
}



// Function to validate inputs
function validateInputs(name, email, phoneNumber) {
  let isValid = true

  // Name validation (basic check: not empty)
  const nameInput = document.getElementById('name')
  const nameLabel = document.getElementById('name-label')
  if (!name.trim()) {
      nameInput.style.borderColor = 'red'
      nameLabel.textContent = 'Nombre completo - Este campo es obligatorio'
      isValid = false
  } else {
      nameInput.style.borderColor = ''
      nameLabel.textContent = 'Nombre completo'
  }

  // Email validation
  const emailInput = document.getElementById('email')
  const emailLabel = document.getElementById('email-label')
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailPattern.test(email)) {
      emailInput.style.borderColor = 'red'
      emailLabel.textContent = 'Email - Por favor ingrese un email válido'
      isValid = false
  } else {
      emailInput.style.borderColor = ''
      emailLabel.textContent = 'Email'
  }

  // Phone number validation
  const isPhoneNumberValid = validatePhoneNumber(phoneNumber)
  if (!isPhoneNumberValid) {
    isValid = false
  }

  return isValid
}

function validatePhoneNumber (phoneNumber) {

  let valid = true

  const phoneInput = document.getElementById('phoneNumber')
  const phoneLabel = document.getElementById('phoneNumber-label')
  const phonePattern = /^09\d{7}$/ // starts with 09 and is 9 digits
  if (!phonePattern.test(phoneNumber)) {
      phoneInput.style.borderColor = 'red'
      phoneLabel.textContent = 'Debe comenzar con 09 y tener 9 dígitos'
      valid = false
  } else {
      phoneInput.style.borderColor = ''
      phoneLabel.textContent = 'Celular'
  }

  return valid

}



// DOM Content Load
document.addEventListener('DOMContentLoaded', async function () {

  const loader = document.getElementById("loader")
  window.addEventListener("load", function () {
    loader.style.display = "none"
  })

  // Form - Sign Up
  if (document.getElementById('form')) {
    document.getElementById('form-btn').addEventListener('click', async function (event) {
      event.preventDefault()

      // Get values from inputs
      const name = document.getElementById('name').value
      const email = document.getElementById('email').value
      const phoneNumber = document.getElementById('phoneNumber').value

      // Validate inputs
      const isFormValid = validateInputs(name, email, phoneNumber)

      if (isFormValid) {

        loader.style.display = "block"

        const clientData = {
          name: name,
          email: email,
          phoneNumber: phoneNumber,
          logCount: 0,
          purchaseCount: 0,
          startDate: new Date(),
          subscription: true,
          lastRating: 0,
          averageRating: 0,
          giftAvailable: false,
          currentPoints: 0,
          totalPoints: 0,
          claimedGifts: 0,
          totalSpent: 0,
          averageExpenditure: 0
        }
  
        try {
          // Instead of authenticating, directly sign up the client
          const signupResponse = await fetch(`${apiUrl}/auth/signup`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(clientData)
          })
  
          if (!signupResponse.ok) {
            throw new Error('Signup failed')
          }
  
          const authData = await signupResponse.json()
          localStorage.setItem('accessToken', authData.accessToken)
          await createClient(clientData)
          await sendCardEmail(clientData)
          console.log('Client created successfully')
          window.location.href = `./done.html?phoneNumber=${phoneNumber}`

        } catch (error) {
          console.error('Error creating or updating client:', error)
          window.location.href = 'login.html'
        } finally {
          loader.style.display = "none"
        }

      } else {
        console.log('Invalid form inputs.')
      }

    })

  }

  // Login
  if (document.getElementById('login')) {

    document.getElementById('login-btn').addEventListener('click', async function (event) {
      event.preventDefault()

      const phoneNumber = document.getElementById('phoneNumber').value
      const isPhoneNumberValid = validatePhoneNumber(phoneNumber)

      if (isPhoneNumberValid) {

        loader.style.display = "block"

        try {
          const authData = await AuthenticatePhoneNumber(phoneNumber)
          if (authData) {
            console.log('Client authenticated successfully')
  
            const client = await getClientByPhoneNumber(phoneNumber)
            updates = {
              logCount: client.logCount += 1
            }
            await updateClient(phoneNumber, updates)
  
            window.location.href = `./index.html?phoneNumber=${phoneNumber}`
          } else {
            alert('User not found.')
            window.location.href = 'form.html'
          }
  
        } catch (error) {
          console.error('Error logging in:', error)
        } finally {
          loader.style.display = "none"
        }

      } else {
        console.log('Invalid phone number')
      }

    })
  
  }

  // Done
  if (document.getElementById('path')) {
    
    const phoneNumber = getPhoneNumberFromURL()
    
    document.getElementById('done-btn').addEventListener('click', async function (event) {
      event.preventDefault()
      window.location.href = `./index.html?phoneNumber=${phoneNumber}`
    })

  }

  // Card
  if (document.getElementById('card')) {
    loader.style.display = "block"
    const phoneNumber = getPhoneNumberFromURL()

    if (phoneNumber) {
      clearURL()
      const client = await getClientByPhoneNumber(phoneNumber)
      console.log(client)
      document.getElementById("client-name").innerHTML = client.name
      document.getElementById("current-points").innerHTML = `${client.currentPoints} / 9`
    } else {
      window.location.href = './path.html'
      console.log('phoneNumber not found in the URL')
    }
    loader.style.display = "none"
  }
})





