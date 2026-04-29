// ════════════════════════════════════════════════════
//  ANBOX HUB — บอทรับยศ 77 จังหวัด
//  ทำโดย: ANBOX DEV
//  วิธีใช้: node index.js
// ════════════════════════════════════════════════════

const { Client, GatewayIntentBits, Partials, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, ButtonBuilder, ButtonStyle, PermissionsBitField } = require('discord.js')

// ══════════════════════════════════
//  ⚙️ ตั้งค่าตรงนี้
// ══════════════════════════════════
const TOKEN = 'MTQ5ODg1ODEyODY3MzA3OTMwNg.GVzKtI.DC5u6P8_Gunsm_asyF6g3viPJW-r-T4iPmuT_U'  // ← TOKEN จาก Discord Developer Portal
const CHANNEL_ID = '1498719476403802162'  // ← ID ห้องที่ต้องการ

// ══════════════════════════════════
//  🗺️ ข้อมูล 77 จังหวัด
// ══════════════════════════════════
const REGIONS = {
  north: {
    name: '🏔️ ภาคเหนือ',
    emoji: '🏔️',
    color: 0x3498db,
    provinces: [
      'เชียงใหม่','เชียงราย','ลำปาง','ลำพูน','แม่ฮ่องสอน',
      'น่าน','พะเยา','แพร่','อุตรดิตถ์','ตาก',
      'สุโขทัย','พิษณุโลก','พิจิตร','กำแพงเพชร','นครสวรรค์',
      'อุทัยธานี','เพชรบูรณ์',
    ],
  },
  northeast: {
    name: '🌾 ภาคอีสาน',
    emoji: '🌾',
    color: 0xe67e22,
    provinces: [
      'นครราชสีมา','ขอนแก่น','อุดรธานี','อุบลราชธานี','บึงกาฬ',
      'หนองคาย','หนองบัวลำภู','เลย','สกลนคร','นครพนม',
      'มุกดาหาร','กาฬสินธุ์','ร้อยเอ็ด','มหาสารคาม','ชัยภูมิ',
      'บุรีรัมย์','สุรินทร์','ศรีสะเกษ','ยโสธร','อำนาจเจริญ',
    ],
  },
  central: {
    name: '🏙️ ภาคกลาง',
    emoji: '🏙️',
    color: 0x9b59b6,
    provinces: [
      'กรุงเทพมหานคร','นนทบุรี','ปทุมธานี','พระนครศรีอยุธยา',
      'อ่างทอง','ลพบุรี','สิงห์บุรี','ชัยนาท','สระบุรี',
      'นครนายก','ปราจีนบุรี','สระแก้ว','ฉะเชิงเทรา',
      'สมุทรปราการ','สมุทรสาคร','สมุทรสงคราม','นครปฐม',
      'สุพรรณบุรี','กาญจนบุรี','ราชบุรี',
    ],
  },
  east: {
    name: '🏖️ ภาคตะวันออก',
    emoji: '🏖️',
    color: 0x1abc9c,
    provinces: [
      'ชลบุรี','ระยอง','จันทบุรี','ตราด','ชัยนาท',
    ],
  },
  west: {
    name: '🌄 ภาคตะวันตก',
    emoji: '🌄',
    color: 0x27ae60,
    provinces: [
      'เพชรบุรี','ประจวบคีรีขันธ์','กาญจนบุรี',
    ],
  },
  south: {
    name: '🏝️ ภาคใต้',
    emoji: '🏝️',
    color: 0xe74c3c,
    provinces: [
      'สุราษฎร์ธานี','นครศรีธรรมราช','กระบี่','พังงา','ภูเก็ต',
      'ตรัง','พัทลุง','สงขลา','สตูล','ปัตตานี',
      'ยะลา','นราธิวาส','ชุมพร','ระนอง',
    ],
  },
}

// ══════════════════════════════════
//  🤖 สร้างบอท
// ══════════════════════════════════
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessageReactions,
  ],
  partials: [Partials.Message, Partials.Reaction, Partials.User],
})

// ══════════════════════════════════
//  📦 เมื่อบอทพร้อมทำงาน
// ══════════════════════════════════
client.once('ready', async () => {
  console.log(`✅ บอทออนไลน์แล้ว: ${client.user.tag}`)
  client.user.setActivity('77 จังหวัด 🇹🇭', { type: 3 }) // Watching

  // ส่ง Embed ไปที่ห้องที่กำหนด
  const channel = await client.channels.fetch(CHANNEL_ID).catch(() => null)
  if (!channel) return console.log('❌ ไม่พบห้อง ID:', CHANNEL_ID)

  // ตรวจว่าส่งไปแล้วยัง (ไม่ส่งซ้ำ)
  const msgs = await channel.messages.fetch({ limit: 10 })
  const alreadySent = msgs.find(m => m.author.id === client.user.id && m.embeds.length > 0)
  if (alreadySent) return console.log('📌 ส่ง Embed ไปแล้ว ไม่ส่งซ้ำ')

  await sendMainEmbed(channel)
})

// ══════════════════════════════════
//  🖼️ ส่ง Embed หลัก
// ══════════════════════════════════
async function sendMainEmbed(channel) {
  const embed = new EmbedBuilder()
    .setColor(0xffd700)
    .setTitle('🇹🇭  ระบบรับยศ 77 จังหวัด')
    .setDescription(
      '> **📢 เลือกภาคและจังหวัดของคุณเพื่อรับยศอัตโนมัติ!**\n\n' +
      '🏔️ **ภาคเหนือ** — 17 จังหวัด\n' +
      '🌾 **ภาคอีสาน** — 20 จังหวัด\n' +
      '🏙️ **ภาคกลาง** — 20 จังหวัด\n' +
      '🏖️ **ภาคตะวันออก** — 5 จังหวัด\n' +
      '🌄 **ภาคตะวันตก** — 3 จังหวัด\n' +
      '🏝️ **ภาคใต้** — 14 จังหวัด\n\n' +
      '**วิธีใช้:**\n' +
      '1️⃣ กด **เลือกภาค** ด้านล่าง\n' +
      '2️⃣ เลือกจังหวัดของคุณ\n' +
      '3️⃣ รับยศทันที! 🎉'
    )
    .setImage('https://cdn.discordapp.com/attachments/1439451385857970176/1458686603794055228/01.png?ex=69f23903&is=69f0e783&hm=9f02c8d543eaaf6e08affeca524ba0621007d922b574c2f86e1a55a813b88d47&')
    .setFooter({ text: 'ANBOX HUB • ระบบรับยศอัตโนมัติ' })
    .setTimestamp()

  // Dropdown เลือกภาค
  const regionMenu = new StringSelectMenuBuilder()
    .setCustomId('select_region')
    .setPlaceholder('📍 กรุณาเลือกภาคของคุณ')
    .addOptions(
      Object.entries(REGIONS).map(([key, r]) => ({
        label: r.name,
        description: `คลิกที่นี่เพื่อเลือก${r.name}`,
        value: key,
        emoji: r.emoji,
      }))
    )

  // ปุ่มรีเซ็ต
  const resetBtn = new ButtonBuilder()
    .setCustomId('reset_province')
    .setLabel('🔄 รีเซ็ตยศจังหวัด')
    .setStyle(ButtonStyle.Danger)

  const row1 = new ActionRowBuilder().addComponents(regionMenu)
  const row2 = new ActionRowBuilder().addComponents(resetBtn)

  await channel.send({ embeds: [embed], components: [row1, row2] })
  console.log('✅ ส่ง Embed เรียบร้อย')
}

// ══════════════════════════════════
//  🎮 จัดการ Interaction
// ══════════════════════════════════
client.on('interactionCreate', async (interaction) => {

  // ─── เลือกภาค ───
  if (interaction.isStringSelectMenu() && interaction.customId === 'select_region') {
    const regionKey = interaction.values[0]
    const region = REGIONS[regionKey]
    if (!region) return

    // สร้าง Dropdown จังหวัด
    const provinces = region.provinces
    const options = provinces.map(p => ({
      label: p,
      description: `รับยศ ${p}`,
      value: `province_${regionKey}_${p}`,
      emoji: '📍',
    }))

    // Discord ให้ได้สูงสุด 25 ตัวต่อ Select Menu
    const menus = []
    for (let i = 0; i < options.length; i += 25) {
      menus.push(
        new StringSelectMenuBuilder()
          .setCustomId(`select_province_${i}`)
          .setPlaceholder(`📍 เลือกจังหวัด (${i + 1}-${Math.min(i + 25, options.length)})`)
          .addOptions(options.slice(i, i + 25))
      )
    }

    const components = menus.slice(0, 5).map(m => new ActionRowBuilder().addComponents(m))

    const embed = new EmbedBuilder()
      .setColor(region.color)
      .setTitle(`${region.emoji} เลือกจังหวัดใน${region.name}`)
      .setDescription(`คุณเลือก **${region.name}** แล้ว\nกรุณาเลือกจังหวัดของคุณด้านล่าง 👇`)
      .setFooter({ text: 'ANBOX HUB • ระบบรับยศอัตโนมัติ' })

    await interaction.reply({ embeds: [embed], components, ephemeral: true })
  }

  // ─── เลือกจังหวัด ───
  if (interaction.isStringSelectMenu() && interaction.customId.startsWith('select_province_')) {
    const value = interaction.values[0] // province_north_เชียงใหม่
    const parts = value.split('_')
    const regionKey = parts[1]
    const provinceName = parts.slice(2).join('_')
    const region = REGIONS[regionKey]

    await interaction.deferReply({ ephemeral: true })

    const guild = interaction.guild
    const member = interaction.member

    // ── สร้าง Role ถ้ายังไม่มี ──
    async function getOrCreateRole(name, color) {
      let role = guild.roles.cache.find(r => r.name === name)
      if (!role) {
        role = await guild.roles.create({
          name,
          color,
          reason: 'ANBOX HUB - ระบบรับยศ 77 จังหวัด',
        })
      }
      return role
    }

    try {
      // Role ภาค
      const regionRole = await getOrCreateRole(region.name, region.color)
      // Role จังหวัด
      const provinceRole = await getOrCreateRole(`📍 ${provinceName}`, region.color)

      // ลบ Role ภาคและจังหวัดเดิมออกก่อน
      const oldRoles = member.roles.cache.filter(r =>
        Object.values(REGIONS).some(reg => reg.name === r.name) ||
        r.name.startsWith('📍 ')
      )
      for (const [, role] of oldRoles) {
        await member.roles.remove(role).catch(() => {})
      }

      // เพิ่ม Role ใหม่
      await member.roles.add(regionRole)
      await member.roles.add(provinceRole)

      const embed = new EmbedBuilder()
        .setColor(region.color)
        .setTitle('✅ รับยศสำเร็จ!')
        .setDescription(
          `ยินดีด้วย **${member.displayName}**! 🎉\n\n` +
          `🗺️ **ภาค:** ${region.name}\n` +
          `📍 **จังหวัด:** ${provinceName}\n\n` +
          `คุณได้รับยศทั้ง 2 แล้วครับ!`
        )
        .setFooter({ text: 'ANBOX HUB • ระบบรับยศอัตโนมัติ' })
        .setTimestamp()

      await interaction.editReply({ embeds: [embed], components: [] })

    } catch (err) {
      console.error('❌ Error:', err)
      await interaction.editReply({
        content: '❌ เกิดข้อผิดพลาด บอทอาจไม่มีสิทธิ์สร้าง Role กรุณาตรวจสอบสิทธิ์ของบอท',
        components: [],
      })
    }
  }

  // ─── รีเซ็ตยศ ───
  if (interaction.isButton() && interaction.customId === 'reset_province') {
    await interaction.deferReply({ ephemeral: true })

    const member = interaction.member
    const oldRoles = member.roles.cache.filter(r =>
      Object.values(REGIONS).some(reg => reg.name === r.name) ||
      r.name.startsWith('📍 ')
    )

    if (!oldRoles.size) {
      return interaction.editReply({ content: '⚠️ คุณยังไม่มียศจังหวัดอยู่ครับ' })
    }

    for (const [, role] of oldRoles) {
      await member.roles.remove(role).catch(() => {})
    }

    const embed = new EmbedBuilder()
      .setColor(0xff0000)
      .setTitle('🔄 รีเซ็ตยศแล้ว')
      .setDescription(`ลบยศจังหวัดและภาคของคุณออกแล้วครับ\nสามารถเลือกใหม่ได้เลย!`)
      .setFooter({ text: 'ANBOX HUB • ระบบรับยศอัตโนมัติ' })

    await interaction.editReply({ embeds: [embed] })
  }
})

// ══════════════════════════════════
//  🚀 เริ่มบอท
// ══════════════════════════════════
client.login(TOKEN)

