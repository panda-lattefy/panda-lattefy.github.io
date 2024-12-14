/* ------------------------------------------------------------------------------------------------- */
/* ------------------------------------------- CAMPAIGNS ------------------------------------------- */
/* ------------------------------------------------------------------------------------------------- */

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

// DOM Content Load
document.addEventListener('DOMContentLoaded', async function () {
    const clients = await getAll('clients')

    // Display audience size
    displayAudienceSize(clients)

    const fileInput = document.getElementById('image-upload')
    const fileName = document.getElementById('file-name')

    fileInput.addEventListener('change', (event) => {
        const file = event.target.files[0]
        if (file) {
            fileName.textContent = file.name
        } else {
            fileName.textContent = ''
        }
    })

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
            await sendCampaignEmail(clients, title, content, imageUrl)
        } catch (error) {
            console.error('Error sending campaign emails:', error)
            alert('Error al enviar la campaña. Por favor, inténtalo de nuevo.')
        }

        loader.style.display = "none"
    })
})
