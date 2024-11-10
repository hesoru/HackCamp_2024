import ollama from 'ollama/browser'

const response = await ollama.chat({
  model: 'llama3.2-vision',
  messages: [{
    role: 'user',
    content: 'What is in this image?',
    images: ['image.jpg']
  }]
})

console.log(response)
