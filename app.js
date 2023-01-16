require('dotenv').config()

const amqp = require('amqplib');
const Listener = require('./src/listener');
const MailSender = require('./src/MailSender');
const PlaylistsService = require('./src/PlaylistsService');

const init = async () => {
  const mailSender = new MailSender()
  const playlistsService = new PlaylistsService()
  const listener = new Listener(playlistsService, mailSender)

  const connection = await amqp.connect(process.env.RABBITMQ_SERVER)
  const channel = await connection.createChannel()

  await channel.assertQueue('export:playlists', { durable: true })

  channel.consume('export:playlists', listener.listen, { noAck: true })
}

init()
