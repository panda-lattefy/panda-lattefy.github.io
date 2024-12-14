// DASHBOARD AUTH

// const authUrl = 'http://localhost:3089'
const authUrl = 'https://backend-v2-2.onrender.com'

async function auth(businessName) {
  const email = getEmailFromURL()
  const password = getPasswordFromURL()

  const accessToken = localStorage.getItem('accessToken')
  const refreshToken = localStorage.getItem('refreshToken')

  if (email && password) {
    await authLogin(email, password) 
  } else if (refreshToken || accessToken){
    await validateTokens(accessToken, refreshToken, businessName) 
  } else {
    window.location.href = 'https://lattefy.com.uy/auth'
  }
}

// Token Validation
async function validateTokens(accessToken, refreshToken, businessName) {

  // Validate access token against the server
  const tokenValid = await validateAccessToken(accessToken, businessName)
  if (!tokenValid) {
    console.log('Access token expired or invalid, refreshing...')
    await refreshAccessToken(refreshToken, businessName)
  } else {
    console.log('Access token is valid')
  }

}

// Validate access token
async function validateAccessToken(accessToken, businessName) {

  try {
      const response = await fetch(`${authUrl}/auth/verify-token`, {
          method: 'GET',
          headers: {
              'Authorization': `Bearer ${accessToken}`
          }
      })

      if (!response.ok) {
          return false
      } else if (response.status === 403 || response.status === 401) {
          return false
      }

      // Parse JSON response
      const data = await response.json()
      if (data.name === businessName) {
        return true
      }

  } catch (error) {
      console.log('Error checking access token validity: ' + error.message)
      return false
  }

}

// Refresh access token
async function refreshAccessToken(refreshToken, businessName) {
  console.log("Refreshing token...")

  try {
    const response = await fetch(`${authUrl}/auth/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token: refreshToken }),
    })

    if (!response.ok) {
      console.warn('Failed to refresh access token. Redirecting to auth page...')
      window.location.href = 'https://lattefy.com.uy/auth'
      return
    }

    const data = await response.json()
    const isValid = await validateAccessToken(data.accessToken, businessName)
    if (!isValid) {
      console.warn('Refreshed access token is invalid. Redirecting to auth page...')
      window.location.href = 'https://lattefy.com.uy/auth'
      return
    }

    localStorage.setItem('accessToken', data.accessToken)
    console.log('Access token refreshed successfully.')
    window.location.reload()

  } catch (error) {
    console.error('Error refreshing access token:', error.message)
    window.location.href = 'https://lattefy.com.uy/auth'
  }
}


// URL utility functions
function getEmailFromURL() {
  const urlParams = new URLSearchParams(window.location.search)
  return urlParams.get('email')
}
function getPasswordFromURL() {
  const urlParams = new URLSearchParams(window.location.search)
  return urlParams.get('password')
}
function clearURL() {
  const urlParams = new URLSearchParams(window.location.search)
  urlParams.delete('email')
  urlParams.delete('password')
  const newUrl = window.location.pathname + (urlParams.toString() ? `?${urlParams.toString()}` : '')
  window.history.replaceState({}, '', newUrl)
}

// Login process
async function authLogin(email, password) {
  clearURL() 

  try {
    const response = await fetch(`${authUrl}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    })

    if (!response.ok) {
      const errorMsg = await response.json()
      throw new Error(errorMsg)
    }

    const data = await response.json()
    localStorage.setItem('accessToken', data.accessToken)
    localStorage.setItem('refreshToken', data.refreshToken)
  
  } catch (error) {
    console.log('Authorization failed: ' + error.message)
    window.location.href = 'https://lattefy.com.uy/auth'
  }

}
