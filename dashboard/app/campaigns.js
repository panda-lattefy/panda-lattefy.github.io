/* ------------------------------------------------------------------------------------------------- */
/* ------------------------------------------- CAMPAIGNS ------------------------------------------- */
/* ------------------------------------------------------------------------------------------------- */

// Global variable to store original clients data
let originalClients = []

// Function to send emails using EmailJS
async function sendCampaignEmail(clients, title, content, imageUrl) {
    try {
        for (const client of clients) {
            if (!client.email) {
                console.error(`Missing email for client: ${client.name}`)
                continue
            }

            const templateParams = {
                to_email: client.email,
                name: client.name,
                title: title,
                content: content,
                image_url: imageUrl || ''
            }

            const serviceID = 'service_llm5u9s'
            const templateID = 'template_cz31rhh'

            await emailjs.send(serviceID, templateID, templateParams)
        }
        alert('Campaña enviada con éxito!')
    } catch (error) {
        console.error('Error sending campaign emails:', error)
        alert('Error al enviar la campaña.')
    }
}

// Function to upload images to Cloudinary
async function uploadImageToCloudinary(imageFile) {
    const formData = new FormData()
    formData.append('file', imageFile)
    formData.append('upload_preset', 'my_unsigned_preset')

    try {
        const response = await fetch('https://api.cloudinary.com/v1_1/dc4g5ehpo/image/upload', {
            method: 'POST',
            body: formData
        })
        const data = await response.json()

        if (response.ok) {
            return data.secure_url
        } else {
            throw new Error(data.error.message)
        }
    } catch (error) {
        console.error('Error uploading the image:', error)
        alert('Error al cargar el archivo.')
    }
}

// Function to display audience size
function displayAudienceSize(clients) {
    const audienceSize = clients.length
    const audienceElement = document.getElementById('audience-size')
    if (audienceElement) {
        audienceElement.textContent = `Tamaño de la audiencia: ${audienceSize}`
    }
}

// Function to filter clients based on criteria
function filterClients(clients, variable, condition, value) {
    return clients.filter(client => {
        const clientValue = client[variable]?.toString().toLowerCase() || ''
        const filterValue = value.toLowerCase()

        if (condition === 'contains') {
            return clientValue.includes(filterValue)
        } else if (condition === 'not-contains') {
            return !clientValue.includes(filterValue)
        }
        return false
    })
}

// Function to update audience size dynamically
function updateAudienceSize(clients) {
    displayAudienceSize(clients)
}

// DOM Content Load
document.addEventListener('DOMContentLoaded', async function () {
    // Fetch all clients once and store them
    originalClients = await getAll('clients')
    let filteredClients = [...originalClients] // Copy of clients for filtering

    // Display initial audience size
    displayAudienceSize(originalClients)

    // File upload logic
    const fileInput = document.getElementById('image-upload')
    const fileName = document.getElementById('file-name')

    fileInput.addEventListener('change', (event) => {
        const file = event.target.files[0]
        fileName.textContent = file ? file.name : 'Subir Archivo'
    })

    // Event listener for "Apply" button (Filter Logic)
    document.getElementById('apply-btn').addEventListener('click', (e) => {
        e.preventDefault()

        // Retrieve filter values
        const variable = document.getElementById('filter-variable').value
        const condition = document.getElementById('filter-condition').value
        const value = document.getElementById('filter-value').value.trim()

        // Validate filter input
        if (!value) {
            alert('Por favor ingrese un valor para filtrar.')
            return
        }

        // Apply filter and update audience
        filteredClients = filterClients(originalClients, variable, condition, value)
        updateAudienceSize(filteredClients)
    })

    // Event listener for "Reset" button (Reset Filters)
    document.getElementById('reset-btn').addEventListener('click', (e) => {
        e.preventDefault()

        // Reset filtered clients to the original list
        filteredClients = [...originalClients]

        // Clear filter input fields
        document.getElementById('filter-variable').selectedIndex = 0
        document.getElementById('filter-condition').selectedIndex = 0
        document.getElementById('filter-value').value = ''

        // Update audience size to the original list
        updateAudienceSize(originalClients)
    })

    // Event listener for "Send Campaign" button
    document.getElementById('campaign-btn').addEventListener('click', async (e) => {
        e.preventDefault()

        const loader = document.getElementById('loader')
        loader.style.display = "block"

        const title = document.getElementById('title').value
        const content = document.getElementById('content').value
        const imageFile = document.getElementById('image-upload').files[0]

        if (!title || !content) {
            alert('Por favor complete el título y el contenido.')
            loader.style.display = "none"
            return
        }

        let imageUrl = ''
        if (imageFile) {
            imageUrl = await uploadImageToCloudinary(imageFile)
        }

        try {
            // Send campaign emails to the filtered clients
            await sendCampaignEmail(filteredClients, title, content, imageUrl)
        } catch (error) {
            console.error('Error sending campaign emails:', error)
            alert('Error al enviar la campaña. Por favor, inténtalo de nuevo.')
        }

        loader.style.display = "none"
    })
})
