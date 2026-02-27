// models/company_model.js

module.exports = (sequelize, DataTypes) => {
  const DEFAULT_COMPANY_NAMES = [
    'Netflix',
    'Disney+',
    'Amazon Prime',
    'Apple Tv+',
    'Hbo Max',
    'Hulu',
    'Peacock',
    'Paramount+',
    'Crunchyroll',
    'Mubi',
    'Spotify',
    'Apple Music',
    'YouTube Music',
    'Tidal',
    'Amazon Music',
    'Deezer',
    'Soundcloud',
    'Pandora',
    'Microsoft 365',
    'Google One',
    'Notion',
    'Slack',
    'Zoom',
    'Dropbox',
    'Evernote',
    'Todoist',
    '1Password',
    'Lastpass',
    'Dashlane',
    'Grammarly',
    'Loom',
    'Trello',
    'Asana',
    'Monday.com',
    'Airtable',
    'Clickup',
    'iCloud',
    'Onedrive',
    'Google Drive',
    'Box',
    'Adobe',
    'Figma',
    'Canva',
    'Envato',
    'Shutterstock',
    'Framer',
    'Sketch',
    'Xbox',
    'Playstation',
    'Nintendo',
    'Ea',
    'Ubisoft',
    'Steam',
    'Twitch',
    'Discord',
    'Peloton',
    'Calm',
    'Headspace',
    'Strava',
    'Myfitnesspal',
    'Audible',
    'Scribd',
    'Medium',
    'Blinkist',
    'Duolingo',
    'Coursera',
    'Udemy',
    'Skillshare',
    'GitHub',
    'Gitlab',
    'Vercel',
    'Netlify',
    'Digitalocean',
    'AWS',
    'Heroku',
    'Linear',
    'Atlassian',
    'Datadog',
    'Sentry',
    'Cloudflare',
    'Postman',
    'Shopify',
    'Hubspot',
    'Salesforce',
    'Zendesk',
    'Mailchimp',
    'Quickbooks',
    'Linkedin',
    'Twitter',
    'X',
    'Amazon',
    'Apple',
    'Nordvpn',
    'Expressvpn'
  ];

  const normalizeName = (value) => value.trim().toLowerCase();

  const Company = sequelize.define("Company", {

    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true
    },

    name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },

    image: {
      type: DataTypes.STRING(500),
      allowNull: true,
      comment: 'URL to company logo'
    },

    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }

  }, {
    tableName: "companies",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    hooks: {
      afterSync: async () => {
        const canonicalNameByNormalized = new Map(
          DEFAULT_COMPANY_NAMES.map((name) => [normalizeName(name), name])
        );

        const existingCompanies = await Company.findAll({
          attributes: ['id', 'name'],
          raw: true
        });

        const companiesToUpdate = existingCompanies.filter((company) => {
          const normalizedExistingName = normalizeName(company.name);
          const canonicalName = canonicalNameByNormalized.get(normalizedExistingName);

          return canonicalName && company.name !== canonicalName;
        });

        if (companiesToUpdate.length > 0) {
          await Promise.all(
            companiesToUpdate.map((company) => {
              const canonicalName = canonicalNameByNormalized.get(normalizeName(company.name));

              return Company.update(
                { name: canonicalName },
                { where: { id: company.id } }
              );
            })
          );
        }

        const existingNameSet = new Set(
          existingCompanies.map((company) => normalizeName(company.name))
        );

        const companiesToCreate = DEFAULT_COMPANY_NAMES
          .filter((name) => !existingNameSet.has(normalizeName(name)))
          .map((name) => ({
            name,
            image: null,
            is_active: true
          }));

        if (companiesToCreate.length > 0) {
          await Company.bulkCreate(companiesToCreate);
        }
      }
    }
  });

  return Company;
};
