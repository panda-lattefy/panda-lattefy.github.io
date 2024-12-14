let originalClients = []
let filteredClients = []

async function sendCampaignEmail(clients, title, content, imageUrl) {
    console.log('Enviando campaña a:', clients.length, 'clientes')
    try {
        for (const client of clients) {
            if (!client.email) {
                console.error(`Falta email para el cliente: ${client.name}`)
                continue
            }

            console.log('Enviando email a:', client.email)

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
        alert('Campaña enviada con éxito')
    } catch (error) {
        console.error('Error al enviar emails:', error)
        alert('Error al enviar la campaña')
    }
}

async function uploadImageToCloudinary(imageFile) {
    const formData = new FormData()
    formData.append('file', imageFile)
    formData.append('upload_preset', 'my_unsigned_preset')

    try {
        console.log('Subiendo imagen a Cloudinary...')
        const response = await fetch('https://api.cloudinary.com/v1_1/dc4g5ehpo/image/upload', {
            method: 'POST',
            body: formData
        })
        const data = await response.json()

        if (response.ok) {
            console.log('Imagen subida con éxito:', data.secure_url)
            return data.secure_url
        } else {
            throw new Error(data.error.message)
        }
    } catch (error) {
        console.error('Error al subir la imagen:', error)
        alert('Error al cargar el archivo')
    }
}

function displayAudienceSize(clients) {
    console.log('Tamaño de la audiencia:', clients.length)
    const audienceElement = document.getElementById('audience-size')
    audienceElement.textContent = `Tamaño de la audiencia: ${clients.length}`
}

function filterClients(clients, variable, condition, value) {
    console.log(`Filtrando por ${variable} con condición ${condition} y valor "${value}"`)
    return clients.filter(client => {
        const clientValue = client[variable]?.toString().toLowerCase() || ''
        const filterValue = value.toLowerCase()

        if (condition === 'contains') return clientValue.includes(filterValue)
        if (condition === 'not-contains') return !clientValue.includes(filterValue)
        return false
    })
}

document.addEventListener('DOMContentLoaded', async function () {
    originalClients = await getAll('clients')
    filteredClients = [...originalClients]
    displayAudienceSize(originalClients)

    const fileInput = document.getElementById('image-upload')
    const fileName = document.getElementById('file-name')

    fileInput.addEventListener('change', (event) => {
        const file = event.target.files[0]
        fileName.textContent = file ? file.name : 'Subir Archivo'
        console.log('Archivo seleccionado:', file ? file.name : 'Ninguno')
    })

    document.getElementById('apply-btn').addEventListener('click', () => {
        const variable = document.getElementById('filter-variable').value
        const condition = document.getElementById('filter-condition').value
        const value = document.getElementById('filter-value').value.trim()

        if (!variable || !value) {
            alert('Por favor ingrese valores válidos para filtrar')
            return
        }

        filteredClients = filterClients(originalClients, variable, condition, value)
        displayAudienceSize(filteredClients)
        console.log('Clientes después de filtrar:', filteredClients)
    })

    document.getElementById('reset-btn').addEventListener('click', () => {
        filteredClients = [...originalClients]
        document.getElementById('filter-variable').selectedIndex = 0
        document.getElementById('filter-condition').selectedIndex = 0
        document.getElementById('filter-value').value = ''
        displayAudienceSize(originalClients)
        console.log('Filtros reiniciados')
    })

    document.getElementById('campaign-btn').addEventListener('click', async () => {
        const title = document.getElementById('title').value
        const content = document.getElementById('content').value
        const imageFile = document.getElementById('image-upload').files[0]

        if (!title || !content) {
            alert('Por favor complete el título y el contenido')
            return
        }

        let imageUrl = ''
        if (imageFile) {
            imageUrl = await uploadImageToCloudinary(imageFile)
        }

        console.log('Iniciando envío de campaña con:')
        console.log('Título:', title)
        console.log('Contenido:', content)
        console.log('Imagen URL:', imageUrl)
        console.log('Clientes a enviar:', filteredClients.length)

        document.getElementById('campaign-btn').disabled = true

        await sendCampaignEmail(filteredClients, title, content, imageUrl)

        document.getElementById('campaign-btn').disabled = false
        alert('Campaña enviada con éxito!')
    })
})
