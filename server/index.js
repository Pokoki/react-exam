// @ts-check

const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const { z } = require("zod");


/**
 * @typedef {Object} Company
 * @property {string} name - The name of the company.
 * @property {string[]} domains - The domains associated with the company.
 * @property {string} description - A description of the company.
 * @property {string} website - The website URL of the company.
 */

/**
 * @type {Record<string, Company>}
 * Note: most of this list is extracted from:
 *       https://jobs.makesense.org/en/projects
 *       Have a look for additional companies!
 */
const companies = {
  "green-got": {
    name: "Green got",
    domains: ["fintech"],
    description:
      "Green-Got is a banking alternative that finances ecological and energy transition (and not oil, coal, or gas, as is the case with the vast majority of traditional banks) through the money of its members.",
    website: "https://green-got.com/",
  },
  helios: {
    name: "Helios",
    domains: ["fintech"],
    description:
      "Grâce à son modèle unique, helios est le seul acteur en France, en dehors des banques traditionnelles, à pouvoir flécher l’investissement de ses dépôts. Ainsi, helios peut garantir l'exclusion des secteurs polluants et le financement de la transition écologique.",
    website: "https://helios.do/",
  },
  "team-for-the-planet": {
    name: "Team for The Planet",
    domains: ["investment"],
    description:
      "Team for the Planet is raising money to detect and deploy 100 global innovations against greenhouse gases.",
    website: "https://team-planet.com/",
  },
  "la-tournee": {
    name: "La Tournee",
    domains: ["no waste"],
    description:
      "La Tournée is the new home delivery model that puts an end to single-use packaging. 300 million is the number of tons of plastic waste produced each year worldwide. 90% of this waste ends up in landfills or in the ocean, with devastating impacts on biodiversity. And this is just the beginning: if we continue on this path, it is estimated that by 2050, we will produce four times more plastic... The principle is simple: La Tournée passes through your neighborhood several times a week, in electric vehicles, to deliver all your everyday products, in reusable containers. With each delivery, the empty containers are collected in exchange for a deposit to be then washed and reused.",
    website: "https://landing.la-tournee.co/",
  },
  "le-fourgon": {
    name: "Le Fourgon",
    domains: ["no waste"],
    description:
      "To reduce waste in France, the founders of Le Fourgon have revived the practice of glass bottle deposits and specialized in home and office delivery of reusable products. Thanks to Le Fourgon, over 4 million bottles have already been reused, resulting in a saving of 1,480 tons of CO2, according to the startup. The company now has over 40,000 customers.",
    website: "https://www.lefourgon.com/",
  },
  sweep: {
    name: "Sweep",
    domains: ["carbon footprint computation"],
    website: "https://www.sweep.net/",
    description:
      "Your carbon and ESG data platform. Sweep’s software streamlines carbon and ESG data in one place. Track, disclose and Act.",
  },
  "fresque-du-climat": {
    website: "https://fresqueduclimat.org/",
    name: "La fresque du climat",
    domains: ["learning"],
    description:
      "La Fresque du Climat permet à chacun·e de comprendre le fonctionnement, l’ampleur et la complexité des enjeux liés aux dérèglements climatiques.",
  },
  "2tonnes": {
    website: "https://www.2tonnes.org/",
    description:
      "En 3 heures et en équipe : projetez-vous jusqu'en 2050, découvrez les leviers individuels et collectifs de la transition écologique, et identifiez le rôle que vous pouvez y jouer !",
    name: "2tonnes",
    domains: ["learning"],
  },

  carbo: {
    description:
      "Our mission is to accelerate ecological awareness to reduce our carbon footprint now.",
    name: "Carbo",
    website: "https://www.hellocarbo.com/",
    domains: ["ecology"],
  },
  "muhalink-repère": {
    description:
      "Recruitment and HR support firm specializing in environmental professions.",
    name: "Muhalink Repère",
    website: "https://www.muhalink-repere.com/",
    domains: ["recruitment"],
  },
  ithaque: {
    description:
      "Facing failed solutions, Ithaque's mission is to make energy renovation accessible to everyone!",
    name: "Ithaque",
    website: "https://www.ithaque-renovation.fr",
    domains: ["energy"],
  },
  vizea: {
    description:
      "Vizea Group specializes in Sustainable Development engineering since 2006. Our goal is to: 'Make possible the transformation of our Society to preserve the planet'.",
    name: "VIZEA",
    website: "https://vizea.fr/",
    domains: ["unknown"],
  },
  azoco2: {
    description:
      "AZOCO2 is an environmental consulting firm that assists companies in calculating their Carbon Footprint and reducing their environmental footprint.",
    name: "Azoco2",
    website: "https://azoco2.com",
    domains: ["consulting"],
  },
  "la-fresque-du-numérique": {
    description:
      "Raising awareness about environmental issues in the digital sector to contribute to the transition to sustainable lifestyles!",
    name: "La Fresque du Numérique",
    website: "https://fresquedunumerique.org/",
    domains: ["learning"],
  },
  "greenpeace-france--luxembourg": {
    description:
      "Since its creation fifty years ago, Greenpeace has been taking action on land and at sea according to the principles of non-violence to protect the environment and promote peace.",
    name: "Greenpeace France & Luxembourg",
    website: "https://www.greenpeace.fr/",
    domains: ["associations"],
  },
  "pur-projet": {
    description:
      "Leader in supply chain sustainability. We work with local communities to develop regenerative agriculture, agroforestry, forest conservation and landscape restoration projects worldwide.",
    name: "PUR ",
    website: "https://www.pur.co/fr/",
    domains: ["agriculture"],
  },
  "groupe-saur": {
    description:
      "Saur is a French group dedicated to water services (provision of drinking water, wastewater treatment, construction, installation and maintenance of equipment).",
    name: "Groupe Saur",
    website: "https://www.saur.com/fr/",
    domains: ["water"],
  },
  "bon-talent": {
    description:
      "We are a recruitment firm that collaborates with responsible companies: we identify and attract professionals (talents) who share the company's vision.",
    name: "BON TALENT",
    website: "https://www.bontalent.fr",
    domains: ["recruitment"],
  },
  "g-on": {
    description:
      "Improve quality of life: sustainable development consulting and engineering, for construction and real estate professionals.",
    name: "G-ON",
    website: "http://www.g-on.fr",
    domains: ["consulting"],
  },
  "dream-act": {
    description:
      "Help companies make more ecological purchases, locally made and under good conditions.",
    name: "Dream Act",
    website: "https://dreamact.eu",
    domains: ["responsible-consumption"],
  },
  "projet-celsius": {
    description:
      "Help companies, schools, and organizations ensure their climate transition. Carbon Footprint, Training, Awareness, and creation of customized educational materials to engage and decarbonize!",
    name: "Projet Celsius",
    website: "https://www.projetcelsius.com",
    domains: ["learning"],
  },
  "la-solive": {
    description:
      "La Solive is the energy renovation bootcamp. We train people in professional conversion to energy renovation professions: project managers, heating engineers, etc.",
    name: "La Solive",
    website: "https://www.la-solive.com/",
    domains: ["learning"],
  },
  "les-alchimistes": {
    description:
      '"Together compost and nourish the soil" - We collect and compost food waste from professionals and households, in a short circuit in cities.',
    name: "Les Alchimistes",
    website: "https://alchimistes.co/",
    domains: ["circular economy"],
  },
  "scop-sanisphere": {
    description:
      "Development of innovative ecological public toilets and associated services, with 0% water, 0% Elec and 100% Comfort for relieving oneself with dignity, our ambition is to stop water toilets!",
    name: "SCOP Sanisphere",
    website: "https://sanisphere-fr.com/",
    domains: ["ecotech"],
  },
  "terres-urbaines": {
    description:
      "Our mission is to bring nature back to the city, develop urban agriculture, and preserve biodiversity.",
    name: "Terres Urbaines",
    website: "http://www.terresurbaines.org",
    domains: ["ecology"],
  },
  "le-cèdre": {
    description:
      "We want to promote an economy that cares about the common good, respects Man and the planet, and knows how to make room for solidarity and equitable relationships, imbued with gratuity.",
    name: "Le Cèdre",
    website: "https://www.lecedre.fr/",
    domains: ["consulting"],
  },
  woodoo: {
    description:
      "Woodoo's mission is to develop a portfolio of wood-based biomaterials to decarbonize industry.",
    name: "WOODOO",
    website: "https://www.woodoo.com/fr/recrutement/",
    domains: ["cleantech"],
  },
  rainette: {
    description:
      "Rainette works for the consideration of biodiversity from the design stage of new development projects.",
    name: "Rainette",
    website: "https://rainette-ecologie.com/",
    domains: ["ecology"],
  },
  miyam: {
    name: "Miyam",
    description:
      "Offer healthy, tasty products at an affordable price while avoiding food waste.",
    website: "https://miyam.fr/",
    domains: ["food"],
  },
  "label-vie": {
    name: "Label Vie",
    description:
      "Label Vie accompanies living spaces in implementing eco-responsible practices: nurseries, childminders, leisure centers.",
    website: "http://www.label-vie.org",
    domains: ["education"],
  },
  ecocert: {
    name: "Ecocert",
    description:
      "Act for a sustainable world by guiding our clients towards more responsible practices through certification, consulting, and training.",
    website: "https://www.ecocert.com/fr/home",
    domains: ["services"],
  },
  "wecount---lacadémie-du-climat-pour-les-entreprises": {
    name: "WeCount",
    description:
      "WeCount is the Climate Academy for Businesses. Our mission: to train, equip, and support future climate leaders in business.",
    website: "https://www.wecount.io/",
    domains: ["consulting"],
  },
  "entrepreneurs-pour-la-planete": {
    name: "ENTREPRENEURS POUR LA PLANETE",
    description:
      "Entrepreneurs for the Planet, the general interest association working for the ecological transition of companies.",
    website: "http://entrepreneurspourlaplanete.org",
    domains: ["ecology"],
  },
  airparif: {
    name: "Airparif",
    description:
      "Monitoring the air breathed in Île-de-France through a robust and reliable measurement device, understanding air pollution and its impacts, accompanying citizens and decision-makers.",
    website: "https://www.airparif.fr/",
    domains: ["pollution"],
  },
  nicomak: {
    name: "Nicomak",
    description:
      "The purpose of Nicomak is to give hope in the ability to act. By making simple what seems complicated, stimulating what seems burdensome, possible what seems impossible.",
    website: "https://www.nicomak.eu/",
    domains: ["consulting"],
  },
  advenio: {
    name: "ADVENIO",
    description:
      "We put our sustainable real estate skills at the service of ecological transition to enable our clients to reduce their environmental footprint.",
    website: "https://www.advenio.fr",
    domains: ["real-estate"],
  },
  atmosud: {
    name: "AtmoSud",
    description:
      "AtmoSud - Inspiring a better air. The reference observatory for Air-Climate-Energy in the Sud region.",
    website: "https://www.atmosud.org/",
    domains: ["pollution"],
  },
  ecotable: {
    name: "Écotable",
    description:
      "Écotable reduces the environmental impact of our diet by transforming the restaurant sector.",
    website: "https://impact.ecotable.fr/",
    domains: ["responsible-consumption"],
  },
  biotope: {
    name: "Biotope",
    description:
      "For 30 years, Biotope has been the leading French private actor in ecological engineering and nature conservation.",
    website: "https://www.biotope.fr",
    domains: ["ecology"],
  },
  "mousqueton-recrutement": {
    name: "Mousqueton Recrutement",
    description:
      "Our mission is to help companies recruit employees trained and sensitized to sustainable development, for a positive future.",
    website: "https://www.mousqueton-recrutement.fr/",
    domains: ["recruitment"],
  },
  morfo: {
    name: "MORFO",
    description:
      "MORFO has developed a solution for large-scale ecological restoration of forest ecosystems in tropical and subtropical regions such as the Atlantic Forest and the African Equatorial Forest.",
    website: "https://www.morfo.rest/",
    domains: ["ecotech"],
  },
  "les-carottes-sauvages": {
    name: "Les Carottes Sauvages",
    description:
      "We are creators of vegetable gardens and creators of bonds (retirement homes, nurseries, town halls). We create vegetable gardens & run workshops with elderly people, adults, children.",
    website: "https://www.carottessauvages.fr/",
    domains: ["social-link"],
  },
  abrico: {
    name: "Abrico",
    description:
      "Our mission: to accelerate the pace of energy renovation in Europe. On Abrico, artisans finance energy renovations for their clients.",
    website: "https://www.abrico.eco/",
    domains: ["fintech"],
  },
  "air-pays-de-la-loire": {
    name: "AIR PAYS DE LA LOIRE",
    description:
      "Monitor and predict air quality in the Pays de la Loire region, inform the population and the competent authorities, support decision-makers in the fight against air pollution...",
    website: "http://www.airpl.org",
    domains: ["ecology"],
  },
  "ma-petite-planete": {
    name: "Ma Petite Planète",
    description:
      "Raise awareness and encourage action (joyfully!) as many people as possible for the preservation of the planet.",
    website: "https://www.mapetiteplanete.org",
    domains: ["learning"],
  },

  changenow: {
    name: "ChangeNOW",
    description:
      "In our mission to accelerate the solutions to the biggest challenges of our century, we organize the ChangeNOW summit, the world's largest event for the planet.",
    website: "https://www.changenow.world/",
    domains: ["citizen-engagement"],
  },
};

const ReducePayloadSchema = z.object({
  yearlyCarbonReduction: z.number(),
});

const app = express();
app.use(express.json());
const cors = require('cors');
app.use(cors());

/**
 * GET /companies route returning a JSON list of companies with id, name, and domains.
 * @param {import('express').Request} req - The request object.
 * @param {import('express').Response} res - The response object.
 */
app.get("/companies", (req, res) => {
  const reducedCompanies = Object.entries(companies)
    .map(([id, { name, domains }]) => ({ id, name, domains }))
    // Shuffling the array
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
  res.json(reducedCompanies);
});

/**
 * GET /company/:id route returning the complete JSON of a company based on its ID.
 * @param {import('express').Request} req - The request object.
 * @param {import('express').Response} res - The response object.
 */
app.get("/company/:id", (req, res) => {
  const { id } = req.params;
  const company = companies[id];
  if (company) {
    res.json(company);
  } else {
    res.status(404).json({ error: "Company not found" });
  }
});

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

/**
 * POST /reduce route accepting a payload of the form { yearlyCarbonReduction: number }.
 * @param {import('express').Request} req - The request object.
 * @param {import('express').Response} res - The response object.
 */
app.post("/reduce", (req, res) => {
  try {
    // Validate payload using Zod schema
    const payload = ReducePayloadSchema.parse(req.body);

    // Broadcast payload to all connected WebSocket clients
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(payload));
      }
    });

    res.status(200).json({ message: "Payload broadcasted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.errors });
  }
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
