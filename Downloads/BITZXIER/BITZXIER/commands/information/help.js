const { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');

module.exports = {
    name: 'help',
    aliases: ['h'],
    category: 'info',
    cooldown: 5,
    premium: false,
    run: async (client, message, args) => {
        let prefix = message.guild?.prefix || '&'; // Default prefix if not set

        const row1 = new ActionRowBuilder().addComponents(
            new StringSelectMenuBuilder()
                .setCustomId('helpop')
                .setPlaceholder(`❯ ${client.user.username} Get Started!`)
                .addOptions([
                    {
                        label: 'AntiNuke',
                        description: 'Get All AntiNuke Command List',
                        value: 'antinuke',
                        emoji: '<:bitzxier_antinuke:1181289584483643433>'
                    },
                    {
                        label: 'Moderation',
                        description: 'Get All Moderation Command List',
                        value: 'moderation',
                        emoji: '<:bitzxier_moderator:1181290384576491561>'
                    },
                    {
                        label: 'Automod',
                        description: 'Get All Automod Command List',
                        value: 'automod',
                        emoji: '<:Bitzxier_Automod:1205791245473943553>'
                    },
                    {
                        label: 'Logger',
                        description: 'Get All Logger Command List',
                        value: 'logger',
                        emoji: '<:logs:1200416495461732353>'
                    },
                    {
                        label: 'Utility',
                        description: 'Get All Utility Command List',
                        value: 'utility',
                        emoji: '<:bitzxier_utility:1181291761667149886>'
                    }
                ])
        );

        const row2 = new ActionRowBuilder().addComponents(
            new StringSelectMenuBuilder()
                .setCustomId('helpop2')
                .setPlaceholder(`❯ ${client.user.username} Get Started!`)
                .addOptions([
                    {
                        label: 'Join To Create',
                        description: 'Get All Join To Create Command List',
                        value: 'jointocreate',
                        emoji: '<:bitzxierjtc:1287754917942923347>'
                    },
                    {
                        label: 'Voice',
                        description: 'Get All Voice Command List',
                        value: 'voice',
                        emoji: '<:bitzxier_mic:1181294198046072994>'
                    },
                    {
                        label: 'Custom Role',
                        description: 'Get All Custom Role Command List',
                        value: 'customrole',
                        emoji: '<:Customrole:1199024011045253140>'
                    },
                    {
                        label: 'Welcomer',
                        description: 'Get All Welcomer Command List',
                        value: 'welcomer',
                        emoji: '<:bitzxier_autorole:1181290290238210158>'
                    },
                    {
                    label : 'Ticket',
                    description : 'Get All Ticket Command List',
                    value : 'ticket',
                    emoji : '<:bitzxierticket:1287755212898959472>'
                    },
                ])
        );

        const categories = {
            category1: [
                "**<:bitzxier_antinuke:1181289584483643433> \`:\` AntiNuke**",
                "**<:bitzxier_moderator:1181290384576491561> \`:\` Moderation**",
                "**<:Bitzxier_Automod:1205791245473943553> \`:\` Automod**",
                "**<:logs:1200416495461732353> \`:\` Logger**",
                "**<:bitzxier_utility:1181291761667149886> \`:\` Utility**",
            ],
            category2: [
                "**<:bitzxierjtc:1287754917942923347> \`:\` Join To Create**",
                "**<:bitzxier_mic:1181294198046072994> \`:\` Voice**",
                "**<:Customrole:1199024011045253140> \`:\` Custom Role**",
                "**<:bitzxier_autorole:1181290290238210158> \`:\` Welcomer**",
                "**<:bitzxierticket:1287755212898959472> \`:\` Ticket**"
            ]
        };

        let developerUser = client.users.cache.get('1180425876798701588') ? client.users.cache.get('1180425876798701588') : await client.users.fetch('1180425876798701588').catch((err) => null)

        const embed = new EmbedBuilder()
            .setColor(client.color)
            .setAuthor({
                name: message.author.tag,
                iconURL: message.author.displayAvatarURL({ dynamic: true })
            })
            .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
            .setDescription(
                `${client.emoji.dot} **Prefix for this server:** \`${prefix}\`\n` +
                `${client.emoji.dot} **Total Commands:** \`${client.util.countCommandsAndSubcommands(client)}\`\n` +
                `${client.emoji.dot} **Type \`&antinuke enable\` to get started!**\n\n${client.config.baseText}`
            )
            .addFields({
                name: '<:bitzxiercat:1220734600821870632> **__Categories__**',
                value: categories.category1.join('\n'),
                inline: true
            })
            .addFields({
                name: '\u200B',
                value: categories.category2.join('\n'),
                inline: true
            })
            .addFields({
                name: "<:linkRed:1221342594001539112> **__Links__**",
                value: `**[Invite Me](https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot) | [Support Server](https://discord.gg/bitzxier)**`
            })
            .setFooter({
                text: `Developed with ❤️ By The Terminator </>`,
                iconURL: developerUser.displayAvatarURL({ dynamic: true })
            });
if (!client.config.owner.includes(message.author.id) && !client.config.admin.includes(message.author.id)) {
    await message.channel.send({ embeds: [embed], components: [row1, row2] });
} else {
    await message.channel.send({ embeds: [embed], components: [row1, row2], content : `Hey Owner, How Can I Help You Today?` });
}

    }
};
