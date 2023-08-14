import express from 'express'
import { engine } from 'express-handlebars'
import { Configuration, OpenAIApi } from 'openai'
import { OPENAI_KEY, PORT } from './config'

//https://platform.openai.com/account/billing/overview
const configuration = new Configuration({
  apiKey: OPENAI_KEY,
})
const openai = new OpenAIApi(configuration)

const app = express()

app.engine('handlebars', engine())
app.set('view engine', 'handlebars')
app.set('views', './src/views')
app.use(express.urlencoded({ extended: true }))

app.get('/', (_, res) => {
  res.render('index')
})

app.post('/', async (req, res) => {
  const prompt = req.body.prompt
  const size = req.body.size ?? '512x512'
  const number = req.body.number ?? 1

  try {
    const response = await openai.createImage({
      prompt,
      size,
      n: Number(number),
    })

    console.log('response123', response)

    res.render('index', {
      response,
      loading: true,
      images: response.data.data,
    })
  } catch (e: any) {
    res.render('index', {
      error: e.message,
    })
  }
})

app.listen(PORT, () => console.log('Server started...'))