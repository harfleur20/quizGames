//base de données des quizz

export const quizQuestions = [
  {
    question: "Quelle est la capitale de l'Allemagne ?",
    answers: [
      { text: "Munich", correct: false },
      { text: "Hambourg", correct: false },
      { text: "Francfort", correct: false },
      { text: "Berlin", correct: true },
    ],
  },
  {
    question: "Quel est l’élément chimique représenté par le symbole O ?",
    answers: [
      { text: "Or", correct: false },
      { text: "Oxalium", correct: false },
      { text: "Osmium", correct: false },
      { text: "Oxygène", correct: true },
    ],
  },
  {
    question: "Quelle est la langue la plus parlée au monde ?",
    answers: [
      { text: "Anglais", correct: false },
      { text: "Espagnol", correct: false },
      { text: "Mandarin", correct: true },
      { text: "Arabe", correct: false },
    ],
  },
  {
    question: "Quel est le plus grand pays du monde en superficie ?",
    answers: [
      { text: "Canada", correct: false },
      { text: "Chine", correct: false },
      { text: "Russie", correct: true },
      { text: "États-Unis", correct: false },
    ],
  },
  {
    question: "Quel océan borde la côte ouest des États-Unis ?",
    answers: [
      { text: "Atlantique", correct: false },
      { text: "Pacifique", correct: true },
      { text: "Indien", correct: false },
      { text: "Arctique", correct: false },
    ],
  },
  {
    question: "Quelle planète est la plus proche du Soleil ?",
    answers: [
      { text: "Terre", correct: false },
      { text: "Venus", correct: false },
      { text: "Mercure", correct: true },
      { text: "Mars", correct: false },
    ],
  },
  {
    question: "Qui a peint la Joconde ?",
    answers: [
      { text: "Léonard de Vinci", correct: true },
      { text: "Michel-Ange", correct: false },
      { text: "Raphaël", correct: false },
      { text: "Donatello", correct: false },
    ],
  },
  {
    question: "Quel est le plus long fleuve du monde ?",
    answers: [
      { text: "Nil", correct: true },
      { text: "Amazone", correct: false },
      { text: "Yangtsé", correct: false },
      { text: "Mississippi", correct: false },
    ],
  },
  {
    question: "De quel pays provient la pizza ?",
    answers: [
      { text: "France", correct: false },
      { text: "Italie", correct: true },
      { text: "États-Unis", correct: false },
      { text: "Espagne", correct: false },
    ],
  },
  {
    question: "Quel est l’animal terrestre le plus rapide ?",
    answers: [
      { text: "Guépard", correct: true },
      { text: "Lion", correct: false },
      { text: "Gazelle", correct: false },
      { text: "Tigre", correct: false },
    ],
  },

  // --- 40 autres questions ci-dessous ---
  {
    question: "Quel pays a remporté la Coupe du Monde 2018 ?",
    answers: [
      { text: "France", correct: true },
      { text: "Croatie", correct: false },
      { text: "Brésil", correct: false },
      { text: "Allemagne", correct: false },
    ],
  },
  {
    question: "Quel est l’organe responsable de pomper le sang ?",
    answers: [
      { text: "Poumons", correct: false },
      { text: "Cœur", correct: true },
      { text: "Foie", correct: false },
      { text: "Reins", correct: false },
    ],
  },
  {
    question: "Quelle est la monnaie du Japon ?",
    answers: [
      { text: "Won", correct: false },
      { text: "Yuan", correct: false },
      { text: "Yen", correct: true },
      { text: "Ringgit", correct: false },
    ],
  },
  {
    question: "Quelle est la plus grande île du monde ?",
    answers: [
      { text: "Madagascar", correct: false },
      { text: "Groenland", correct: true },
      { text: "Islande", correct: false },
      { text: "Bornéo", correct: false },
    ],
  },
  {
    question: "En quelle année YouTube a-t-il été créé ?",
    answers: [
      { text: "2003", correct: false },
      { text: "2007", correct: false },
      { text: "2005", correct: true },
      { text: "2010", correct: false },
    ],
  },
  {
    question: "Quel est l’inventeur de l’électricité moderne ?",
    answers: [
      { text: "Albert Einstein", correct: false },
      { text: "Nikola Tesla", correct: true },
      { text: "Galilée", correct: false },
      { text: "Isaac Newton", correct: false },
    ],
  },
  {
    question: "Quel est le plus grand désert du monde ?",
    answers: [
      { text: "Sahara", correct: false },
      { text: "Antarctique", correct: true },
      { text: "Gobi", correct: false },
      { text: "Kalahari", correct: false },
    ],
  },
  {
    question: "Quel pays est surnommé « le pays du Soleil levant » ?",
    answers: [
      { text: "Chine", correct: false },
      { text: "Corée du Sud", correct: false },
      { text: "Japon", correct: true },
      { text: "Thaïlande", correct: false },
    ],
  },
  {
    question: "Combien de continents existe-t-il ?",
    answers: [
      { text: "4", correct: true },
      { text: "6", correct: false },
      { text: "7", correct: false },
      { text: "8", correct: false },
    ],
  },
  {
    question: "Dans quel sport utilise-t-on une balle jaune ?",
    answers: [
      { text: "Golf", correct: false },
      { text: "Tennis", correct: true },
      { text: "Handball", correct: false },
      { text: "Rugby", correct: false },
    ],
  },
  {
    question: "Quel est le plus grand mammifère marin ?",
    answers: [
      { text: "Requin blanc", correct: false },
      { text: "Baleine bleue", correct: true },
      { text: "Orque", correct: false },
      { text: "Cachalot", correct: false },
    ],
  },
  {
    question: "Quelle est la capitale du Canada ?",
    answers: [
      { text: "Toronto", correct: false },
      { text: "Vancouver", correct: false },
      { text: "Ottawa", correct: true },
      { text: "Montréal", correct: false },
    ],
  },
  {
    question: "Quel est le plus petit pays du monde ?",
    answers: [
      { text: "Monaco", correct: false },
      { text: "Vatican", correct: true },
      { text: "Liechtenstein", correct: false },
      { text: "Malte", correct: false },
    ],
  },
  {
    question: "Quelle est la capitale du Cameroun ?",
    answers: [
      { text: "Douala", correct: false },
      { text: "Yaoundé", correct: true },
      { text: "Bafoussam", correct: false },
      { text: "Garoua", correct: false },
    ],
  },
  {
    question: "Quel est le langage utilisé pour styliser une page web ?",
    answers: [
      { text: "HTML", correct: false },
      { text: "CSS", correct: true },
      { text: "JavaScript", correct: false },
      { text: "Python", correct: false },
    ],
  },
  {
    question: "Quel est l’instrument de musique avec 6 cordes ?",
    answers: [
      { text: "Violon", correct: false },
      { text: "Ukulélé", correct: false },
      { text: "Basse", correct: false },
      { text: "Guitare", correct: true },
    ],
  },
  {
    question: "Dans quel pays se trouve la muraille de Chine ?",
    answers: [
      { text: "Japon", correct: false },
      { text: "Chine", correct: true },
      { text: "Corée", correct: false },
      { text: "Inde", correct: false },
    ],
  },
  {
    question: "Quel est l'animal symbole de la sagesse ?",
    answers: [
      { text: "Lion", correct: false },
      { text: "Chouette", correct: true },
      { text: "Renard", correct: false },
      { text: "Serpent", correct: false },
    ],
  },
  {
    question: "Quel sport est associé à Usain Bolt ?",
    answers: [
      { text: "Football", correct: false },
      { text: "Basketball", correct: false },
      { text: "Athlétisme", correct: true },
      { text: "Natation", correct: false },
    ],
  },
  {
    question: "Combien de joueurs sur un terrain de football (par équipe) ?",
    answers: [
      { text: "9", correct: false },
      { text: "10", correct: false },
      { text: "11", correct: true },
      { text: "12", correct: false },
    ],
  },
  {
    question: "En informatique, que signifie CPU ?",
    answers: [
      { text: "Central Processing Unit", correct: true },
      { text: "Computer Power Unit", correct: false },
      { text: "Core Programming Utility", correct: false },
      { text: "Central Print Unit", correct: false },
    ],
  },
  {
    question: "Quel film a introduit le personnage de Dark Vador ?",
    answers: [
      { text: "Star Wars I", correct: false },
      { text: "Star Wars IV", correct: true },
      { text: "Star Wars V", correct: false },
      { text: "Star Wars II", correct: false },
    ],
  },
  {
    question: "Quel métal attire fortement les aimants ?",
    answers: [
      { text: "Or", correct: false },
      { text: "Cuivre", correct: false },
      { text: "Fer", correct: true },
      { text: "Aluminium", correct: false },
    ],
  },
  {
    question: "Qui est l’inventeur du téléphone ?",
    answers: [
      { text: "Thomas Edison", correct: false },
      { text: "Alexander Graham Bell", correct: true },
      { text: "Nikola Tesla", correct: false },
      { text: "Marconi", correct: false },
    ],
  },

  {
    question: "Quelle est la capitale du Japon ?",
    answers: [
      { text: "Tokyo", correct: true },
      { text: "Osaka", correct: false },
      { text: "Kyoto", correct: false },
      { text: "Nagoya", correct: false },
    ],
  },
  {
    question: "Quel est l’organe responsable de la circulation du sang ?",
    answers: [
      { text: "Le cœur", correct: true },
      { text: "Le foie", correct: false },
      { text: "L’estomac", correct: false },
      { text: "Le rein", correct: false },
    ],
  },
  {
    question: "Combien de continents existe-t-il ?",
    answers: [
      { text: "5", correct: false },
      { text: "6", correct: false },
      { text: "7", correct: true },
      { text: "8", correct: false },
    ],
  },
  {
    question: "Quel métal est liquide à température ambiante ?",
    answers: [
      { text: "Mercure", correct: true },
      { text: "Fer", correct: false },
      { text: "Aluminium", correct: false },
      { text: "Or", correct: false },
    ],
  },
  {
    question: "Qui a peint La Joconde ?",
    answers: [
      { text: "Michel-Ange", correct: false },
      { text: "Raphaël", correct: false },
      { text: "Leonard de Vinci", correct: true },
      { text: "Van Gogh", correct: false },
    ],
  },
  {
    question: "Quelle est la plus grande planète du système solaire ?",
    answers: [
      { text: "Terre", correct: false },
      { text: "Jupiter", correct: true },
      { text: "Saturne", correct: false },
      { text: "Mars", correct: false },
    ],
  },
  {
    question: "Quel est l’océan le plus profond ?",
    answers: [
      { text: "Atlantique", correct: false },
      { text: "Pacifique", correct: true },
      { text: "Indien", correct: false },
      { text: "Arctique", correct: false },
    ],
  },
  {
    question: "Qui a inventé l’ampoule électrique ?",
    answers: [
      { text: "Nikola Tesla", correct: false },
      { text: "Thomas Edison", correct: true },
      { text: "Benjamin Franklin", correct: false },
      { text: "Alexander Graham Bell", correct: false },
    ],
  },
  {
    question: "Quel pays a remporté la Coupe du Monde 2018 ?",
    answers: [
      { text: "Allemagne", correct: false },
      { text: "Brésil", correct: false },
      { text: "France", correct: true },
      { text: "Argentine", correct: false },
    ],
  },
  {
    question: "Quel est le symbole chimique du sodium ?",
    answers: [
      { text: "S", correct: false },
      { text: "Na", correct: true },
      { text: "So", correct: false },
      { text: "Sn", correct: false },
    ],
  },

  // --- 40 autres questions (total 50) ---

  {
    question: "Quel est l’animal terrestre le plus rapide ?",
    answers: [
      { text: "Lion", correct: false },
      { text: "Guépard", correct: true },
      { text: "Tigre", correct: false },
      { text: "Gazelle", correct: false },
    ],
  },
  {
    question: "Qui a découvert la gravité selon la légende ?",
    answers: [
      { text: "Albert Einstein", correct: false },
      { text: "Isaac Newton", correct: true },
      { text: "Galilée", correct: false },
      { text: "Kepler", correct: false },
    ],
  },
  {
    question: "Combien de dents a un adulte (en moyenne) ?",
    answers: [
      { text: "26", correct: false },
      { text: "28", correct: false },
      { text: "32", correct: true },
      { text: "34", correct: false },
    ],
  },
  {
    question: "Quel est le plus grand désert du monde ?",
    answers: [
      { text: "Sahara", correct: false },
      { text: "Antarctique", correct: true },
      { text: "Gobi", correct: false },
      { text: "Kalahari", correct: false },
    ],
  },
  {
    question: "Quelle langue a le plus de locuteurs natifs ?",
    answers: [
      { text: "Anglais", correct: false },
      { text: "Mandarin", correct: true },
      { text: "Espagnol", correct: false },
      { text: "Arabe", correct: false },
    ],
  },
  {
    question: "Combien y a-t-il d’os dans le corps humain ?",
    answers: [
      { text: "106", correct: false },
      { text: "206", correct: true },
      { text: "256", correct: false },
      { text: "300", correct: false },
    ],
  },
  {
    question: "Quel pays est surnommé ‘le pays du soleil levant’ ?",
    answers: [
      { text: "Chine", correct: false },
      { text: "Japon", correct: true },
      { text: "Corée du Sud", correct: false },
      { text: "Thaïlande", correct: false },
    ],
  },
  {
    question: "Quel est le plus petit pays du monde ?",
    answers: [
      { text: "Monaco", correct: false },
      { text: "Vatican", correct: true },
      { text: "Malte", correct: false },
      { text: "Andorre", correct: false },
    ],
  },
  {
    question: "Quel est l’élément le plus abondant dans l’univers ?",
    answers: [
      { text: "Oxygène", correct: false },
      { text: "Hydrogène", correct: true },
      { text: "Hélium", correct: false },
      { text: "Carbone", correct: false },
    ],
  },
  {
    question: "Quel est le plus long fleuve du monde ?",
    answers: [
      { text: "Nil", correct: false },
      { text: "Amazon", correct: true },
      { text: "Mississippi", correct: false },
      { text: "Yangtsé", correct: false },
    ],
  },

  {
    question:
      "Quel langage est principalement utilisé pour le développement d'applications Android ?",
    answers: [
      { text: "Swift", correct: false },
      { text: "Kotlin", correct: true },
      { text: "Ruby", correct: false },
      { text: "PHP", correct: false },
    ],
  },
  {
    question: "Que signifie HTML ?",
    answers: [
      { text: "HyperText Markup Language", correct: true },
      { text: "HighText Machine Language", correct: false },
      { text: "HyperTransfer Media Link", correct: false },
      { text: "Home Tool Markup Language", correct: false },
    ],
  },
  {
    question: "Quel framework JavaScript est développé par Facebook ?",
    answers: [
      { text: "Angular", correct: false },
      { text: "Vue.js", correct: false },
      { text: "React", correct: true },
      { text: "Svelte", correct: false },
    ],
  },
  {
    question: "Que signifie SQL ?",
    answers: [
      { text: "Structured Query Language", correct: true },
      { text: "System Query Link", correct: false },
      { text: "System Quality Language", correct: false },
      { text: "Structured Quality Link", correct: false },
    ],
  },
  {
    question: "Quel outil permet de gérer les versions d’un projet ?",
    answers: [
      { text: "Docker", correct: false },
      { text: "Git", correct: true },
      { text: "Jenkins", correct: false },
      { text: "NPM", correct: false },
    ],
  },
  {
    question: "Quel est le créateur de Linux ?",
    answers: [
      { text: "Linus Torvalds", correct: true },
      { text: "Bill Gates", correct: false },
      { text: "Steve Jobs", correct: false },
      { text: "Mark Zuckerberg", correct: false },
    ],
  },
  {
    question: "Quel protocole est utilisé pour sécuriser les sites web ?",
    answers: [
      { text: "HTTP", correct: false },
      { text: "SMTP", correct: false },
      { text: "HTTPS", correct: true },
      { text: "FTP", correct: false },
    ],
  },
  {
    question: "Quel langage est utilisé pour le style des pages web ?",
    answers: [
      { text: "JavaScript", correct: false },
      { text: "Python", correct: false },
      { text: "CSS", correct: true },
      { text: "C#", correct: false },
    ],
  },
  {
    question: "Docker permet principalement de :",
    answers: [
      { text: "Créer des interfaces", correct: false },
      { text: "Gérer des machines virtuelles lourdes", correct: false },
      { text: "Créer et gérer des conteneurs", correct: true },
      { text: "Compiler du code", correct: false },
    ],
  },
  {
    question: "Quel outil d'intégration continue est développé par GitLab ?",
    answers: [
      { text: "Travis CI", correct: false },
      { text: "GitLab CI/CD", correct: true },
      { text: "CircleCI", correct: false },
      { text: "Jenkins", correct: false },
    ],
  },

  // … 40 autres questions tech ci-dessous …

  {
    question: "Quel langage est nativement exécuté dans les navigateurs web ?",
    answers: [
      { text: "C++", correct: false },
      { text: "JavaScript", correct: true },
      { text: "Python", correct: false },
      { text: "Rust", correct: false },
    ],
  },
  {
    question: "Quel service cloud appartient à Amazon ?",
    answers: [
      { text: "Azure", correct: false },
      { text: "AWS", correct: true },
      { text: "Google Cloud", correct: false },
      { text: "DigitalOcean", correct: false },
    ],
  },
  {
    question: "Quel mot décrit un défaut dans un programme informatique ?",
    answers: [
      { text: "Bug", correct: true },
      { text: "Error", correct: false },
      { text: "Glitch", correct: false },
      { text: "Crash", correct: false },
    ],
  },
  {
    question: "Quel outil permet de containeriser des applications ?",
    answers: [
      { text: "Node.js", correct: false },
      { text: "Docker", correct: true },
      { text: "PHP", correct: false },
      { text: "Composer", correct: false },
    ],
  },
  {
    question:
      "Quel langage est principalement utilisé pour l'intelligence artificielle ?",
    answers: [
      { text: "Python", correct: true },
      { text: "Go", correct: false },
      { text: "C", correct: false },
      { text: "Lua", correct: false },
    ],
  },
  {
    question: "Que signifie API ?",
    answers: [
      { text: "Application Programming Interface", correct: true },
      { text: "Advanced Program Interaction", correct: false },
      { text: "Automated Process Interface", correct: false },
      { text: "Application Process Integration", correct: false },
    ],
  },
  {
    question: "Quel est le système d'exploitation mobile développé par Apple ?",
    answers: [
      { text: "Android", correct: false },
      { text: "HarmonyOS", correct: false },
      { text: "iOS", correct: true },
      { text: "Ubuntu Touch", correct: false },
    ],
  },
  {
    question: "Quel outil permet de créer des environnements virtuels Python ?",
    answers: [
      { text: "pip install", correct: false },
      { text: "venv", correct: true },
      { text: "npm", correct: false },
      { text: "brew", correct: false },
    ],
  },
  {
    question: "Quel type de base de données utilise des documents JSON ?",
    answers: [
      { text: "MySQL", correct: false },
      { text: "PostgreSQL", correct: false },
      { text: "MongoDB", correct: true },
      { text: "OracleDB", correct: false },
    ],
  },
  {
    question: "React utilise un DOM :",
    answers: [
      { text: "Traditionnel", correct: false },
      { text: "Virtuel", correct: true },
      { text: "Physique", correct: false },
      { text: "Temporaire", correct: false },
    ],
  },

  // 50 questions supplémentaires (total 100)
  {
    question: "Quelle est la capitale de l'Égypte ?",
    answers: [
      { text: "Alexandrie", correct: false },
      { text: "Le Caire", correct: true },
      { text: "Louxor", correct: false },
      { text: "Assouan", correct: false },
    ],
  },
  {
    question: "Quel est le plus grand lac d'Afrique ?",
    answers: [
      { text: "Lac Victoria", correct: true },
      { text: "Lac Tanganyika", correct: false },
      { text: "Lac Malawi", correct: false },
      { text: "Lac Turkana", correct: false },
    ],
  },
  {
    question: "Qui a écrit 'Les Misérables' ?",
    answers: [
      { text: "Victor Hugo", correct: true },
      { text: "Alexandre Dumas", correct: false },
      { text: "Émile Zola", correct: false },
      { text: "Gustave Flaubert", correct: false },
    ],
  },
  {
    question: "Quelle est la vitesse de la lumière dans le vide ?",
    answers: [
      { text: "300 000 km/s", correct: true },
      { text: "150 000 km/s", correct: false },
      { text: "450 000 km/s", correct: false },
      { text: "1 000 000 km/s", correct: false },
    ],
  },
  {
    question: "Quel est l'élément chimique avec le symbole Au ?",
    answers: [
      { text: "Argent", correct: false },
      { text: "Or", correct: true },
      { text: "Aluminium", correct: false },
      { text: "Argon", correct: false },
    ],
  },
  {
    question: "Combien de côtés a un hexagone ?",
    answers: [
      { text: "5", correct: false },
      ,
      { text: "7", correct: false },
      { text: "8", correct: false },
      { text: "6", correct: true },
    ],
  },
  {
    question: "Quelle est la bonne phrase ?",
    answers: [
      { text: "C'est à moi", correct: true },
      { text: "C'est à moi", correct: false },
      { text: "C'est à moi", correct: false },
      { text: "C'est a moi", correct: false },
    ],
  },
  {
    question: "Qui a peint 'La Nuit étoilée' ?",
    answers: [
      { text: "Vincent van Gogh", correct: true },
      { text: "Claude Monet", correct: false },
      { text: "Pablo Picasso", correct: false },
      { text: "Salvador Dalí", correct: false },
    ],
  },
  {
    question: "Quel est le plus grand organe du corps humain ?",
    answers: [
      { text: "Le foie", correct: false },
      { text: "Le cerveau", correct: false },
      { text: "La peau", correct: true },
      { text: "Les poumons", correct: false },
    ],
  },
  {
    question: "Quel animal est connu comme 'le roi de la jungle' ?",
    answers: [
      { text: "Le tigre", correct: false },
      { text: "L'éléphant", correct: false },
      { text: "Le lion", correct: true },
      { text: "Le gorille", correct: false },
    ],
  },
  {
    question: "Quelle est la capitale de l'Australie ?",
    answers: [
      { text: "Sydney", correct: false },
      { text: "Melbourne", correct: false },
      { text: "Canberra", correct: true },
      { text: "Perth", correct: false },
    ],
  },
  {
    question: "Combien de jours y a-t-il dans une année bissextile ?",
    answers: [
      { text: "364", correct: false },
      { text: "365", correct: false },
      { text: "366", correct: true },
      { text: "367", correct: false },
    ],
  },
  {
    question: "Quel est le gaz le plus abondant dans l'atmosphère terrestre ?",
    answers: [
      { text: "Oxygène", correct: false },
      { text: "Azote", correct: true },
      { text: "Dioxyde de carbone", correct: false },
      { text: "Argon", correct: false },
    ],
  },
  {
    question: "Qui a découvert la pénicilline ?",
    answers: [
      { text: "Alexander Fleming", correct: true },
      { text: "Louis Pasteur", correct: false },
      { text: "Marie Curie", correct: false },
      { text: "Albert Einstein", correct: false },
    ],
  },
  {
    question: "Quelle est la plus haute montagne d'Afrique ?",
    answers: [
      { text: "Mont Kenya", correct: false },
      { text: "Kilimandjaro", correct: true },
      { text: "Mont Stanley", correct: false },
      { text: "Ras Dashan", correct: false },
    ],
  },
  {
    question:
      "Quel est le langage de programmation créé par Guido van Rossum ?",
    answers: [
      { text: "Java", correct: false },
      { text: "Python", correct: true },
      { text: "JavaScript", correct: false },
      { text: "C++", correct: false },
    ],
  },
  {
    question: "Combien de joueurs dans une équipe de basketball ?",
    answers: [
      { text: "4", correct: false },
      { text: "5", correct: true },
      { text: "6", correct: false },
      { text: "7", correct: false },
    ],
  },
  {
    question: "Quelle est la capitale du Brésil ?",
    answers: [
      { text: "Rio de Janeiro", correct: false },
      { text: "São Paulo", correct: false },
      { text: "Brasilia", correct: true },
      { text: "Salvador", correct: false },
    ],
  },
  {
    question: "Quel est le plus petit os du corps humain ?",
    answers: [
      { text: "Os du poignet", correct: false },
      { text: "L'étrier (oreille)", correct: true },
      { text: "Os du nez", correct: false },
      { text: "Vertèbre cervicale", correct: false },
    ],
  },
  {
    question: "Qui a écrit 'Roméo et Juliette' ?",
    answers: [
      { text: "William Shakespeare", correct: true },
      { text: "Charles Dickens", correct: false },
      { text: "Jane Austen", correct: false },
      { text: "Mark Twain", correct: false },
    ],
  },
  {
    question: "Quel est le désert le plus chaud du monde ?",
    answers: [
      { text: "Sahara", correct: true },
      { text: "Désert d'Arabie", correct: false },
      { text: "Désert de Gobi", correct: false },
      { text: "Désert de Kalahari", correct: false },
    ],
  },
  {
    question: "Combien de planètes dans le système solaire ?",
    answers: [
      { text: "7", correct: false },
      { text: "8", correct: true },
      { text: "9", correct: false },
      { text: "10", correct: false },
    ],
  },
  {
    question: "Quelle est la monnaie de la Chine ?",
    answers: [
      { text: "Yen", correct: false },
      { text: "Yuan", correct: true },
      { text: "Won", correct: false },
      { text: "Ringgit", correct: false },
    ],
  },
  {
    question: "Qui a inventé le téléphone portable ?",
    answers: [
      { text: "Martin Cooper", correct: true },
      { text: "Steve Jobs", correct: false },
      { text: "Bill Gates", correct: false },
      { text: "Tim Berners-Lee", correct: false },
    ],
  },
  {
    question: "Quel est l'animal national de l'Inde ?",
    answers: [
      { text: "Lion", correct: false },
      { text: "Éléphant", correct: false },
      { text: "Tigre", correct: true },
      { text: "Paon", correct: false },
    ],
  },
  {
    question: "Quelle est la capitale de l'Italie ?",
    answers: [
      { text: "Milan", correct: false },
      { text: "Venise", correct: false },
      { text: "Rome", correct: true },
      { text: "Florence", correct: false },
    ],
  },
  {
    question: "Combien de continents commencent par la lettre 'A' ?",
    answers: [
      { text: "1", correct: false },
      { text: "2", correct: true },
      { text: "3", correct: false },
      { text: "4", correct: false },
    ],
  },
  {
    question: "Quel est le métal le plus conducteur d'électricité ?",
    answers: [
      { text: "Cuivre", correct: false },
      { text: "Aluminium", correct: false },
      { text: "Argent", correct: true },
      { text: "Or", correct: false },
    ],
  },
  {
    question: "Qui a peint 'Le Cri' ?",
    answers: [
      { text: "Edvard Munch", correct: true },
      { text: "Paul Gauguin", correct: false },
      { text: "Henri Matisse", correct: false },
      { text: "Wassily Kandinsky", correct: false },
    ],
  },
  {
    question: "Quelle est la langue officielle du Brésil ?",
    answers: [
      { text: "Espagnol", correct: false },
      { text: "Portugais", correct: true },
      { text: "Anglais", correct: false },
      { text: "Français", correct: false },
    ],
  },
  {
    question: "Combien d'heures dans une journée ?",
    answers: [
      { text: "12", correct: false },
      { text: "24", correct: true },
      { text: "36", correct: false },
      { text: "48", correct: false },
    ],
  },
  {
    question: "Quel est le fruit le plus consommé au monde ?",
    answers: [
      { text: "Pomme", correct: false },
      { text: "Banane", correct: false },
      { text: "Tomate", correct: true },
      { text: "Orange", correct: false },
    ],
  },
  {
    question: "Qui a fondé Microsoft ?",
    answers: [
      { text: "Steve Jobs", correct: false },
      { text: "Bill Gates", correct: true },
      { text: "Mark Zuckerberg", correct: false },
      { text: "Larry Page", correct: false },
    ],
  },
  {
    question: "Quelle est la capitale du Mexique ?",
    answers: [
      { text: "Guadalajara", correct: false },
      { text: "Cancún", correct: false },
      { text: "Mexico", correct: true },
      { text: "Monterrey", correct: false },
    ],
  },
  {
    question: "Combien de doigts a une main humaine ?",
    answers: [
      { text: "4", correct: false },
      { text: "5", correct: true },
      { text: "6", correct: false },
      { text: "7", correct: false },
    ],
  },
  {
    question: "Quel est l'océan le plus petit ?",
    answers: [
      { text: "Arctique", correct: true },
      { text: "Indien", correct: false },
      { text: "Atlantique", correct: false },
      { text: "Pacifique", correct: false },
    ],
  },
  {
    question: "Qui a écrit 'Harry Potter' ?",
    answers: [
      { text: "J.K. Rowling", correct: true },
      { text: "J.R.R. Tolkien", correct: false },
      { text: "George R.R. Martin", correct: false },
      { text: "C.S. Lewis", correct: false },
    ],
  },
  {
    question: "Quelle est la planète la plus proche de la Terre ?",
    answers: [
      { text: "Mars", correct: false },
      { text: "Vénus", correct: true },
      { text: "Mercure", correct: false },
      { text: "Jupiter", correct: false },
    ],
  },
  {
    question: "Combien de lettres dans l'alphabet français ?",
    answers: [
      { text: "24", correct: false },
      { text: "25", correct: false },
      { text: "26", correct: true },
      { text: "27", correct: false },
    ],
  },
  {
    question: "Quel est le pays le plus peuplé du monde ?",
    answers: [
      { text: "Inde", correct: false },
      { text: "Chine", correct: true },
      { text: "États-Unis", correct: false },
      { text: "Indonésie", correct: false },
    ],
  },
  {
    question: "Qui a inventé l'avion ?",
    answers: [
      { text: "Les frères Wright", correct: true },
      { text: "Henry Ford", correct: false },
      { text: "Leonardo da Vinci", correct: false },
      { text: "Thomas Edison", correct: false },
    ],
  },
  {
    question: "Quelle est la capitale de l'Espagne ?",
    answers: [
      { text: "Barcelone", correct: false },
      { text: "Séville", correct: false },
      { text: "Madrid", correct: true },
      { text: "Valence", correct: false },
    ],
  },
  {
    question: "Combien de sens a un être humain ?",
    answers: [
      { text: "4", correct: false },
      { text: "5", correct: true },
      { text: "6", correct: false },
      { text: "7", correct: false },
    ],
  },
  {
    question: "Quel est le métal liquide à température ambiante ?",
    answers: [
      { text: "Mercure", correct: true },
      { text: "Fer", correct: false },
      { text: "Or", correct: false },
      { text: "Argent", correct: false },
    ],
  },
  {
    question: "Qui a découvert l'Amérique ?",
    answers: [
      { text: "Christophe Colomb", correct: true },
      { text: "Vasco de Gama", correct: false },
      { text: "Marco Polo", correct: false },
      { text: "Fernand de Magellan", correct: false },
    ],
  },
  {
    question: "Quelle est la langue la plus parlée en Amérique du Sud ?",
    answers: [
      { text: "Anglais", correct: false },
      { text: "Portugais", correct: true },
      { text: "Espagnol", correct: false },
      { text: "Français", correct: false },
    ],
  },
  {
    question: "Combien de saisons dans une année ?",
    answers: [
      { text: "2", correct: false },
      { text: "3", correct: false },
      { text: "4", correct: true },
      { text: "5", correct: false },
    ],
  },
  {
    question: "Quel est l'animal le plus rapide du monde ?",
    answers: [
      { text: "Guépard", correct: false },
      { text: "Faucon pèlerin", correct: true },
      { text: "Antilope", correct: false },
      { text: "Épaulard", correct: false },
    ],
  },
  {
    question: "Qui a peint 'La Cène' ?",
    answers: [
      { text: "Michel-Ange", correct: false },
      { text: "Leonardo da Vinci", correct: true },
      { text: "Raphaël", correct: false },
      { text: "Donatello", correct: false },
    ],
  },
  {
    question: "Quelle est la capitale de la Corée du Sud ?",
    answers: [
      { text: "Busan", correct: false },
      { text: "Incheon", correct: false },
      { text: "Séoul", correct: true },
      { text: "Daegu", correct: false },
    ],
  },
  {
    question: "Combien de chromosomes dans une cellule humaine ?",
    answers: [
      { text: "23", correct: false },
      { text: "46", correct: true },
      { text: "48", correct: false },
      { text: "50", correct: false },
    ],
  },
  {
    question: "Quel est l'os le plus long du corps humain ?",
    answers: [
      { text: "Fémur", correct: true },
      { text: "Tibia", correct: false },
      { text: "Humérus", correct: false },
      { text: "Radius", correct: false },
    ],
  },
  {
    question: "Quelle est la capitale de la Russie ?",
    answers: [
      { text: "Saint-Pétersbourg", correct: false },
      { text: "Moscou", correct: true },
      { text: "Kiev", correct: false },
      { text: "Minsk", correct: false },
    ],
  },
  {
    question: "Qui est le dieu de la foudre dans la mythologie grecque ?",
    answers: [
      { text: "Poséidon", correct: false },
      { text: "Hadès", correct: false },
      { text: "Zeus", correct: true },
      { text: "Apollon", correct: false },
    ],
  },

  {
    question: "Combien d'années y a-t-il dans un millénaire ?",
    answers: [
      { text: "100", correct: false },
      { text: "1000", correct: true },
      { text: "10 000", correct: false },
      { text: "1 000 000", correct: false },
    ],
  },

  {
    question: "En quelle année a été créé TikTok ?",
    answers: [
      { text: "2016", correct: true },
      { text: "2014", correct: false },
      { text: "2018", correct: false },
      { text: "2020", correct: false },
    ],
  },
  {
    question: "Comment écrit-on le pluriel de « Chacal » ?",
    answers: [
      { text: "Chacaux", correct: false },
      { text: "Chacals", correct: true }, // Position 2
      { text: "Chacauls", correct: false },
      { text: "Chacau", correct: false },
    ],
  },
  {
    question:
      "Quelle figure de style consiste à dire le contraire de ce que l'on pense ?",
    answers: [
      { text: "L'allégorie", correct: false },
      { text: "La métaphore", correct: false },
      { text: "L'anaphore", correct: false },
      { text: "L'antiphrase", correct: true }, // Position 4
    ],
  },
  {
    question: "Le mot « Gens » est particulier car :",
    answers: [
      {
        text: "Il peut être masculin ou féminin selon sa place",
        correct: true,
      }, // Position 1
      { text: "Il est toujours singulier", correct: false },
      { text: "C'est un verbe déguisé", correct: false },
      { text: "Il ne s'utilise qu'au Québec", correct: false },
    ],
  },
  {
    question: "Quel mot est un pléonasme courant mais incorrect ?",
    answers: [
      { text: "Sortir dehors", correct: true }, // Position 1
      { text: "Manger vite", correct: false },
      { text: "Courir loin", correct: false },
      { text: "Dormir bien", correct: false },
    ],
  },
  {
    question:
      "Dans la phrase « Les pommes que j'ai mangées », pourquoi « mangées » prend-il « es » ?",
    answers: [
      { text: "Le sujet est pluriel", correct: false },
      { text: "C'est une exception", correct: false },
      { text: "Le COD est placé avant le verbe", correct: true }, // Position 3
      { text: "Le verbe est à l'imparfait", correct: false },
    ],
  },
  {
    question: "Quel est le pays le plus peuplé d'Afrique ?",
    answers: [
      { text: "L'Égypte", correct: false },
      { text: "L'Afrique du Sud", correct: false },
      { text: "Le Nigeria", correct: true },
      { text: "L'Éthiopie", correct: false },
    ],
  },
  {
    question: "Lequel de ces mots doit toujours s'écrire avec une majuscule ?",
    answers: [
      { text: "Un anglais (la personne)", correct: true }, // Position 1
      { text: "L'anglais (la langue)", correct: false },
      { text: "Un adjectif", correct: false },
      { text: "Une religion", correct: false },
    ],
  },
  {
    question: "Quel est le synonyme soutenu de « Cacher » ?",
    answers: [
      { text: "Montrer", correct: false },
      { text: "Exhiber", correct: false },
      { text: "Dévoiler", correct: false },
      { text: "Dissimuler", correct: true }, // Position 4
    ],
  },
  {
    question: "« Il faut que je... » est suivi de quel mode ?",
    answers: [
      { text: "Indicatif", correct: false },
      { text: "Conditionnel", correct: false },
      { text: "Subjonctif", correct: true }, // Position 3
      { text: "Impératif", correct: false },
    ],
  },
  {
    question: "Combien de « L » et de « M » y a-t-il dans « Dilemme » ?",
    answers: [
      { text: "Deux L, un M", correct: false },
      { text: "Un L, deux M", correct: true }, // Position 2
      { text: "Deux L, deux M", correct: false },
      { text: "Un L, un M", correct: false },
    ],
  },
  {
    question: "Lequel de ces mots est une préposition ?",
    answers: [
      { text: "Table", correct: false },
      { text: "Grand", correct: false },
      { text: "Manger", correct: false },
      { text: "Chez", correct: true }, // Position 4
    ],
  },
  {
    question: "Que désigne un « barbarisme » ?",
    answers: [
      { text: "Une faute de vocabulaire ou mot déformé", correct: true }, // Position 1
      { text: "Un mot très ancien", correct: false },
      { text: "Une insulte", correct: false },
      { text: "Un mot étranger", correct: false },
    ],
  },
  {
    question: "Quelle est la bonne orthographe ?",
    answers: [
      { text: "Cauchemard", correct: false },
      { text: "Cauchmar", correct: false },
      { text: "Cauchemar", correct: true }, // Position 3
      { text: "Cochemar", correct: false },
    ],
  },
  {
    question: "Le mot « Mille » (nombre) :",
    answers: [
      { text: "Prend un S s'il y en a plusieurs", correct: false },
      { text: "Est toujours invariable", correct: true }, // Position 2
      { text: "S'accorde seulement au début de phrase", correct: false },
      { text: "Prend un X au pluriel", correct: false },
    ],
  },
  {
    question: "Comment appelle t-on la femelle du gorille ?",
    answers: [
      { text: "La jumente", correct: false },
      { text: "La gorille", correct: false },
      { text: "La corse", correct: false },
      { text: "la guenon", correct: true }, // Position 4
    ],
  },
  {
    question: "Qu'est-ce qu'une « périphrase » ?",
    answers: [
      {
        text: "Remplacer un mot par une expression qui le décrit",
        correct: true,
      }, // Position 1
      { text: "Une phrase très longue", correct: false },
      { text: "Une répétition inutile", correct: false },
      { text: "Un signe de ponctuation", correct: false },
    ],
  },
  {
    question: "Comment appelle t- on cet « ï » dans le mot « Naïve » ?",
    answers: [
      { text: "L'accent aigu", correct: false },
      { text: "Le tréma", correct: true }, // Position 2
      { text: "L'accent grave", correct: false },
      { text: "L'accent circonflexe", correct: false },
    ],
  },
  {
    question: "Quel mot est de la même famille que « Dent » ?",
    answers: [
      { text: "Danser", correct: false },
      { text: "Dense", correct: false },
      { text: "Odontologie", correct: true }, // Position 3
      { text: "Danger", correct: false },
    ],
  },
  {
    question: "« Je suis allé » : quel est l'auxiliaire ?",
    answers: [
      { text: "Avoir", correct: false },
      { text: "Aller", correct: false },
      { text: "Faire", correct: false },
      { text: "Être", correct: true }, // Position 4
    ],
  },
  {
    question: "Que signifie le préfixe « Hydro » ?",
    answers: [
      { text: "Terre", correct: false },
      { text: "Eau", correct: true }, // Position 2
      { text: "Air", correct: false },
      { text: "Feu", correct: false },
    ],
  },
  {
    question: "Dans « Une voix de stentor », que signifie « stentor » ?",
    answers: [
      { text: "Une voix très faible", correct: false },
      { text: "Une voix très aiguë", correct: false },
      { text: "Une voix forte et retentissante", correct: true }, // Position 3
      { text: "Une voix enrouée", correct: false },
    ],
  },
  {
    question: "Quel mot est un homophone de « Vert » ?",
    answers: [
      { text: "Vair", correct: true }, // Position 1
      { text: "Varech", correct: false },
      { text: "Vérité", correct: false },
      { text: "Verbe", correct: false },
    ],
  },
  {
    question: "Le verbe « Résoudre » au passé composé donne :",
    answers: [
      { text: "J'ai résolu", correct: true }, // Position 1
      { text: "J'ai résoudré", correct: false },
      { text: "J'ai résolvé", correct: false },
      { text: "J'ai résous", correct: false },
    ],
  },
  {
    question: "Quelle lettre est muette dans le mot « Doigt » ?",
    answers: [
      { text: "Le i", correct: false },
      { text: "Le o", correct: false },
      { text: "Le g", correct: true }, // Position 3
      { text: "Le d", correct: false },
    ],
  },

  // --- INFORMATIQUE & TECH (25 questions) ---
  {
    question: "Quel raccourci permet de rechercher du texte dans une page ?",
    answers: [
      { text: "Ctrl + S", correct: false },
      { text: "Ctrl + P", correct: false },
      { text: "Alt + F4", correct: false },
      { text: "Ctrl + F", correct: true }, // Position 4
    ],
  },
  {
    question: "Qu'est-ce qu'un « Ransomware » ?",
    answers: [
      { text: "Un logiciel antivirus gratuit", correct: false },
      { text: "Un logiciel malveillant demandant une rançon", correct: true }, // Position 2
      { text: "Un composant de l'ordinateur", correct: false },
      { text: "Un type de clavier mécanique", correct: false },
    ],
  },
  {
    question:
      "Quel câble transmet à la fois l'image et le son en haute qualité ?",
    answers: [
      { text: "VGA", correct: false },
      { text: "DVI", correct: false },
      { text: "HDMI", correct: true }, // Position 3
      { text: "Jack", correct: false },
    ],
  },
  {
    question: "Quelle erreur s'affiche quand une page web est introuvable ?",
    answers: [
      { text: "Erreur 404", correct: true }, // Position 1
      { text: "Erreur 500", correct: false },
      { text: "Erreur 200", correct: false },
      { text: "Erreur 301", correct: false },
    ],
  },
  {
    question: "Quel est le cerveau de l'ordinateur ?",
    answers: [
      { text: "Le disque dur", correct: false },
      { text: "Le ventilateur", correct: false },
      { text: "Le processeur (CPU)", correct: true }, // Position 3
      { text: "L'écran", correct: false },
    ],
  },
  {
    question: "Que signifie le sigle « GAFAM » ?",
    answers: [
      { text: "Google, Amazon, Facebook, Apple, Microsoft", correct: true }, // Position 1
      { text: "Groupe des Analystes Financiers Américains", correct: false },
      {
        text: "Grandes Associations Françaises des Arts Modernes",
        correct: false,
      },
      { text: "Google, Apple, Ford, Amazon, McDonald's", correct: false },
    ],
  },
  {
    question: "Quel animal est la mascotte du langage de programmation PHP ?",
    answers: [
      { text: "Un serpent", correct: false },
      { text: "Une baleine", correct: false },
      { text: "Un éléphant", correct: true }, // Position 3
      { text: "Un chat", correct: false },
    ],
  },
  {
    question: "Comment appelle-t-on le logiciel qui gère l'ordinateur ?",
    answers: [
      { text: "Le BIOS", correct: false },
      { text: "Le Système d'Exploitation (OS)", correct: true }, // Position 2
      { text: "Le Traitement de texte", correct: false },
      { text: "Le compilateur", correct: false },
    ],
  },
  {
    question: "Qu'est-ce qu'un « Cheval de Troie » en informatique ?",
    answers: [
      { text: "Un jeu de stratégie", correct: false },
      { text: "Un antivirus puissant", correct: false },
      { text: "Une marque d'ordinateur", correct: false },
      { text: "Un virus caché dans un programme légitime", correct: true }, // Position 4
    ],
  },
  {
    question: "Quelle est l'unité de fréquence d'un processeur ?",
    answers: [
      { text: "Le Gigahertz (GHz)", correct: true }, // Position 1
      { text: "Le Gigaoctet (Go)", correct: false },
      { text: "Le Pixel", correct: false },
      { text: "Le Watt", correct: false },
    ],
  },
  {
    question:
      "Sur un clavier AZERTY, quelle touche permet d'écrire en majuscule ?",
    answers: [
      { text: "Tab", correct: false },
      { text: "Entrée", correct: false },
      { text: "Shift (Maj)", correct: true }, // Position 3
      { text: "Espace", correct: false },
    ],
  },
  {
    question: "Que signifie « URL » ?",
    answers: [
      { text: "Universal Resource Locator", correct: true }, // Position 1
      { text: "Ultra Rapid Link", correct: false },
      { text: "United Research Lab", correct: false },
      { text: "User Remote Login", correct: false },
    ],
  },
  {
    question: "Quel est l'ancêtre d'Internet ?",
    answers: [
      { text: "Minitel", correct: false },
      { text: "Ethernet", correct: false },
      { text: "Arpanet", correct: true }, // Position 3
      { text: "Skynet", correct: false },
    ],
  },
  {
    question:
      "Quelle technologie sans fil permet de payer avec son téléphone (sans contact) ?",
    answers: [
      { text: "Bluetooth", correct: false },
      { text: "NFC", correct: true }, // Position 2
      { text: "Wi-Fi", correct: false },
      { text: "4G", correct: false },
    ],
  },
  {
    question: "Comment s'appelle l'IA conversationnelle de Apple ?",
    answers: [
      { text: "Siri", correct: true },
      { text: "Alexa", correct: false },
      { text: "Cortana", correct: false },
      { text: "ChatGPT", correct: false }, // Position 4
    ],
  },
  {
    question: "Que mesure le « Ping » dans un jeu vidéo ?",
    answers: [
      { text: "La qualité graphique", correct: false },
      { text: "Le nombre de joueurs", correct: false },
      { text: "La latence", correct: true }, // Position 3
      { text: "Le score", correct: false },
    ],
  },
  {
    question:
      "Quel format est utilisé pour compresser des fichiers (archives) ?",
    answers: [
      { text: ".txt", correct: false },
      { text: ".zip", correct: true }, // Position 2
      { text: ".png", correct: false },
      { text: ".mp4", correct: false },
    ],
  },
  {
    question: "Qui a racheté le réseau social professionnel LinkedIn ?",
    answers: [
      { text: "Google", correct: false },
      { text: "Amazon", correct: false },
      { text: "Apple", correct: false },
      { text: "Microsoft", correct: true }, // Position 4
    ],
  },
  {
    question: "Quelle touche permet de rafraîchir une page web ?",
    answers: [
      { text: "F5", correct: true }, // Position 1
      { text: "F1", correct: false },
      { text: "F12", correct: false },
      { text: "Echap", correct: false },
    ],
  },
  {
    question: "Qu'est-ce qu'un « Pixel » ?",
    answers: [
      { text: "Un câble", correct: false },
      { text: "Un virus", correct: false },
      { text: "Le plus petit point d'une image numérique", correct: true }, // Position 3
      { text: "Une marque de téléphone", correct: false },
    ],
  },
  {
    question: "Quelle commande permet de coller du texte ?",
    answers: [
      { text: "Ctrl + X", correct: false },
      { text: "Ctrl + V", correct: true }, // Position 2
      { text: "Ctrl + C", correct: false },
      { text: "Ctrl + S", correct: false },
    ],
  },
  {
    question:
      "Quel langage est principalement utilisé pour créer le design d'un site web ?",
    answers: [
      { text: "PHP", correct: false },
      { text: "SQL", correct: false },
      { text: "Python", correct: false },
      { text: "CSS", correct: true }, // Position 4
    ],
  },
  {
    question: "Quel rappeur est le frère de Dadju ?",
    answers: [
      { text: "Maitre Gims", correct: true },
      { text: "Soprano", correct: false },
      { text: "Black M", correct: false },
      { text: "Gradur", correct: false },
    ],
  },
  {
    question: "Quelle entreprise fabrique les processeurs « Ryzen » ?",
    answers: [
      { text: "Intel", correct: false },
      { text: "Nvidia", correct: false },
      { text: "AMD", correct: true }, // Position 3
      { text: "Samsung", correct: false },
    ],
  },
  {
    question: "Que signifie « IoT » ?",
    answers: [
      { text: "Internet of Things ", correct: true }, // Position 1
      { text: "Input of Technology", correct: false },
      { text: "International Office of Tech", correct: false },
      { text: "Image on TV", correct: false },
    ],
  },

  // --- ARGENT & RAPPORT À L'ARGENT (25 questions) ---
  {
    question: "Quel groupe de rap français avait pour membre 'Maitre Gims' ?",
    answers: [
      { text: "PNL", correct: false },
      { text: "Sexion d'Assaut", correct: true },
      { text: "Nekfeu", correct: false },
      { text: "Lomepal", correct: false },
    ],
  },
  {
    question: "Qui a inventé l'imprimerie ?",
    answers: [
      { text: "Johannes Gutenberg", correct: true },
      { text: "Galilée", correct: false },
      { text: "Isaac Newton", correct: false },
      { text: "Thomas Edison", correct: false },
    ],
  },
  {
    question: "Quelle est la plus haute montagne du monde ?",
    answers: [
      { text: "K2", correct: false },
      { text: "Mont Everest", correct: true },
      { text: "Mont Blanc", correct: false },
      { text: "Kilimandjaro", correct: false },
    ],
  },
  {
    question: "Qui a composé la Symphonie n°5 ?",
    answers: [
      { text: "Beethoven", correct: true },
      { text: "Mozart", correct: false },
      { text: "Sebastian Bach", correct: false },
      { text: "Frédéric Chopin", correct: false },
    ],
  },
  {
    question: "Que signifie « être à découvert » ?",
    answers: [
      { text: "Ne pas avoir d'assurance", correct: false },
      { text: "Avoir un solde bancaire inférieur à zéro", correct: true }, // Position 2
      { text: "Avoir oublié son code de carte bleue", correct: false },
      { text: "Avoir perdu son portefeuille", correct: false },
    ],
  },
  {
    question: "Lequel est un synonyme de 'intelligent' ?",
    answers: [
      { text: "Bête", correct: false },
      { text: "Brillant", correct: true },
      { text: "Lent", correct: false },
      { text: "Simple", correct: false },
    ],
  },
  {
    question: "quelle couleur obtient on en mélangeant du rouge et du bleu ?",
    answers: [
      { text: "Le rose", correct: false },
      { text: "le vert", correct: false }, // Position 2
      { text: "Le marron", correct: false },
      { text: "Le violet", correct: true },
    ],
  },

  {
    question: "Quel super-héros lance son bouclier ?",
    answers: [
      { text: "Iron-man", correct: false },
      { text: "Batman", correct: false },
      { text: "Mentalist", correct: false },
      { text: "Captain América", correct: true },
    ],
  },

  {
    question: "Quelle est la bonne orthographe ?",
    answers: [
      { text: "Apparemment", correct: true },
      { text: "Aparentement", correct: false },
      { text: "Apparement", correct: false },
      { text: "Aparenttement", correct: false },
    ],
  },
  {
    question: "Qu'est-ce qu'une « mensualité » ?",
    answers: [
      {
        text: "Une somme payée tous les mois ",
        correct: true,
      }, // Position 1
      { text: "Une fête mensuelle", correct: false },
      { text: "Un salaire annuel", correct: false },
      { text: "Une taxe unique", correct: false },
    ],
  },
  {
    question: "Quel métal est une valeur refuge en crise ?",
    answers: [
      { text: "Le cuivre", correct: false },
      { text: "Le plomb", correct: false },
      { text: "Le fer", correct: false },
      { text: "L'or", correct: true }, // Position 4
    ],
  },
  {
    question: "Que signifie « vivre au-dessus de ses moyens » ?",
    answers: [
      { text: "Vivre au dernier étage", correct: false },
      { text: "Dépenser plus d'argent que l'on en gagne", correct: true }, // Position 2
      { text: "Gagner beaucoup d'argent", correct: false },
      { text: "Investir tout son salaire", correct: false },
    ],
  },
  {
    question: "Qu'est-ce qu'un « RIB » ?",
    answers: [
      { text: "Relevé d'Identité Bancaire", correct: true }, // Position 1
      { text: "Remboursement Immédiat Bancaire", correct: false },
      { text: "Reçu Interne de Banque", correct: false },
      { text: "Registre International Bancaire", correct: false },
    ],
  },
  {
    question: "Quelle est la fonction de 'très' dans 'très joli' ?",
    answers: [
      { text: "Adverbe", correct: true },
      { text: "Adjectif", correct: false },
      { text: "Nom", correct: false },
      { text: "Préposition", correct: false },
    ],
  },
  {
    question: "Qu'est-ce que le « Troc » ?",
    answers: [
      { text: "Une monnaie électronique", correct: false },
      { text: "Un impôt ancien", correct: false },
      {
        text: "Échange direct bien contre autre",
        correct: true,
      }, // Position 3
      { text: "Une technique de vente", correct: false },
    ],
  },
  {
    question:
      "Quel joueur de football a remporté à lui seul « 8 ballons d'or » ?",
    answers: [
      { text: "Benzema", correct: false },
      {
        text: "Christiano Ronaldo",
        correct: false,
      }, // Position 2
      { text: "Neymar", correct: false },
      { text: "Lionel Messi", correct: true },
    ],
  },
  {
    question: "Qu'est-ce qu'une « dépense fixe » ?",
    answers: [
      { text: "Une dépense imprévue", correct: false },
      { text: "Une dépense pour le plaisir", correct: false },
      {
        text: "Une dépense qui ne bouge pas",
        correct: true,
      }, // Position 3
      { text: "Une dépense en liquide", correct: false },
    ],
  },
  {
    question: "Qui est Warren Buffett ?",
    answers: [
      { text: "Un célèbre chanteur", correct: false },
      { text: "Un inventeur", correct: false },
      { text: "Un président américain", correct: false },
      { text: "Un des plus célèbres investisseurs au monde", correct: true }, // Position 4
    ],
  },
  {
    question: "Quel terme désigne l'argent que l'on doit à quelqu'un ?",
    answers: [
      { text: "Une créance", correct: false },
      { text: "Une dette", correct: true }, // Position 2
      { text: "Un capital", correct: false },
      { text: "Une dividende", correct: false },
    ],
  },
  {
    question: "En bourse, qu'est-ce qu'un « Krach » ?",
    answers: [
      { text: "Une hausse soudaine", correct: false },
      { text: "Un nouveau produit", correct: false },
      { text: "Une chute brutale des cours", correct: true }, // Position 3
      { text: "Une fusion d'entreprises", correct: false },
    ],
  },
  {
    question: "Que signifie « Spéculer » ?",
    answers: [
      {
        text: "Achat-revente spéculatif",
        correct: true,
      }, // Position 1
      { text: "Économiser prudemment", correct: false },
      { text: "Travailler dur", correct: false },
      { text: "Donner de l'argent", correct: false },
    ],
  },
  {
    question: "Comment s'appelaient les guerrières du royaume du Dahomey ?",
    answers: [
      { text: "Les Amazones du Dahomey", correct: true },
      { text: "Les Lionnes du Bénin", correct: false },
      { text: "Les Guerrières Fon", correct: false },
      { text: "Les Minon", correct: false },
    ],
  },
  {
    question: "Lequel est un antonyme de 'grand' ?",
    answers: [
      { text: "Énorme", correct: false },
      { text: "Moyen", correct: false },
      { text: "Gros", correct: false },
      { text: "Petit", correct: true },
    ],
  },
  {
    question: "Qui a dit 'Je pense, donc je suis' ?",
    answers: [
      { text: "René Descartes", correct: true },
      { text: "Socrate", correct: false },
      { text: "Platon", correct: false },
      { text: "Aristote", correct: false },
    ],
  },
  {
    question: "Qu'est-ce qu'un « Paradis fiscal » ?",
    answers: [
      { text: "Un pays où il fait beau", correct: false },
      {
        text: "Un pays aux faibles taxes",
        correct: true,
      },
      { text: "Une banque en faillite", correct: false },
      { text: "Un type d'investissement", correct: false },
    ],
  },

  {
    question: "Combien de couleurs dans l'arc-en-ciel ?",
    answers: [
      { text: "5", correct: false },
      { text: "6", correct: false },
      { text: "7", correct: true },
      { text: "8", correct: false },
    ],
  },
  {
    question: "Quelle est la bonne conjugaison : 'Nous _____ ce film' ?",
    answers: [
      { text: "avons vu", correct: true },
      { text: "sommes vus", correct: false },
      { text: "avons vus", correct: false },
      { text: "sommes vu", correct: false },
    ],
  },
  {
    question: "Lequel est un synonyme de 'triste' ?",
    answers: [
      { text: "Heureux", correct: false },
      { text: "Mélancolique", correct: true },
      { text: "Gai", correct: false },
      { text: "Content", correct: false },
    ],
  },
  {
    question: "Quelle est la fonction de 'sans' dans 'sans pain' ?",
    answers: [
      { text: "Préposition", correct: true },
      { text: "Adverbe", correct: false },
      { text: "Conjonction", correct: false },
      { text: "Nom", correct: false },
    ],
  },
  {
    question: "Dans quel pays se trouve l'île de Bali ?",
    answers: [
      { text: "Thaïlande", correct: false },
      { text: "Philippines", correct: false },
      { text: "Malaisie", correct: false },
      { text: "Indonésie", correct: true }, // Position 4
    ],
  },
  {
    question: "Quelle est la monnaie utilisée au Royaume-Uni ?",
    answers: [
      { text: "L'Euro", correct: false },
      { text: "Le Dollar", correct: false },
      { text: "La Livre Sterling", correct: true }, // Position 3
      { text: "Le Franc", correct: false },
    ],
  },
  {
    question: "Qu'est-ce qu'une « Auberge de jeunesse » ?",
    answers: [
      { text: "Un hébergement économique", correct: true }, // Position 1
      { text: "Un hôtel 5 étoiles", correct: false },
      { text: "Une école", correct: false },
      { text: "Un camping sauvage", correct: false },
    ],
  },
  {
    question:
      "Quel est le nom du célèbre train qui traverse la Russie (Moscou-Vladivostok) ?",
    answers: [
      { text: "L'Orient Express", correct: false },
      { text: "Le Transsibérien", correct: true }, // Position 2
      { text: "Le TGV", correct: false },
      { text: "Le Poudlard Express", correct: false },
    ],
  },
  {
    question: "Lequel n'est pas un pronom personnel ?",
    answers: [
      { text: "Moi", correct: false },
      { text: "Toi", correct: false },
      { text: "Lui", correct: false },
      { text: "Quel", correct: true },
    ],
  },
  {
    question:
      "Quel site naturel américain est un immense canyon creusé par le Colorado ?",
    answers: [
      { text: "Yellowstone", correct: false },
      { text: "Le Grand Canyon", correct: true }, // Position 2
      { text: "Yosemite", correct: false },
      { text: "Niagara Falls", correct: false },
    ],
  },
  {
    question: "Quelle est la conjugaison correcte : 'Ils _____ au marché' ?",
    answers: [
      { text: "sont allés", correct: true },
      { text: "ont allé", correct: false },
      { text: "sont allé", correct: false },
      { text: "ont allés", correct: false },
    ],
  },
  {
    question: "Quel est l'indicatif téléphonique international de la France ?",
    answers: [
      { text: "+1", correct: false },
      { text: "+44", correct: false },
      { text: "+33", correct: true }, // Position 3
      { text: "+49", correct: false },
    ],
  },
  {
    question: "Lequel de ces mots est un adverbe ?",
    answers: [
      { text: "Rapidement", correct: true },
      { text: "Rapide", correct: false },
      { text: "Rapidité", correct: false },
      { text: "Rapider", correct: false },
    ],
  },
  {
    question: "Qu'est-ce qu'un « E-billet » ?",
    answers: [
      { text: "Un billet électronique", correct: true }, // Position 1
      { text: "Un billet perdu", correct: false },
      { text: "Un billet très cher", correct: false },
      { text: "Un billet confisqué", correct: false },
    ],
  },
  {
    question: "Quel est le pluriel de 'journal' ?",
    answers: [
      { text: "Journals", correct: false },
      { text: "Journales", correct: false },
      { text: "Journaux", correct: true },
      { text: "Journalx", correct: false },
    ],
  },
  {
    question: "Quel pays est surnommé le « Pays du matin calme » ?",
    answers: [
      { text: "Le Japon", correct: false },
      { text: "La Chine", correct: false },
      { text: "Le Vietnam", correct: false },
      { text: "La Corée du Sud", correct: true }, // Position 4
    ],
  },
  {
    question: "En avion, qu'est-ce qu'un « bagage cabine » ?",
    answers: [
      { text: "Le sac que l'on garde avec soi dans l'avion", correct: true }, // Position 1
      { text: "La valise qui va en soute", correct: false },
      { text: "Le repas servi à bord", correct: false },
      { text: "Le gilet de sauvetage", correct: false },
    ],
  },
  {
    question: "Qui a fondé Amazon ?",
    answers: [
      { text: "Jeff Bezos", correct: true },
      { text: "Elon Musk", correct: false },
      { text: "Mark Zuckerberg", correct: false },
      { text: "Jack Ma", correct: false },
    ],
  },
  {
    question: "Quelle est la cryptomonnaie la plus célèbre créée en 2009 ?",
    answers: [
      { text: "Ethereum", correct: false },
      { text: "Bitcoin", correct: true },
      { text: "Dogecoin", correct: false },
      { text: "Litecoin", correct: false },
    ],
  },
  {
    question:
      "Quelle application est très utilisée pour se repérer (GPS) en voyage ?",
    answers: [
      { text: "Photoshop", correct: false },
      { text: "Google Maps", correct: true }, // Position 2
      { text: "Netflix", correct: false },
      { text: "Spotify", correct: false },
    ],
  },
  {
    question: "Dans quelle ville se trouve la Statue de la Liberté ?",
    answers: [
      { text: "Washington", correct: false },
      { text: "San Francisco", correct: false },
      { text: "New York", correct: true }, // Position 3
      { text: "Philadelphie", correct: false },
    ],
  },
  {
    question: "Quel est le nom du méchant dans l'animé Démons Slayers ?",
    answers: [
      { text: "Muzan", correct: true }, // Position 1
      { text: "Cel", correct: false },
      { text: "Dark Vador", correct: false },
      { text: "Maito", correct: false },
    ],
  },
  {
    question: "Quelle merveille du monde se trouve en Inde ?",
    answers: [
      { text: "La Grande Muraille", correct: false },
      { text: "Le Colisée", correct: false },
      { text: "Le Christ Rédempteur", correct: false },
      { text: "Le Taj Mahal", correct: true }, // Position 4
    ],
  },
  {
    question: "Que signifie « Duty Free » dans un aéroport ?",
    answers: [
      { text: "Entrée libre", correct: false },
      { text: "Boutique sans taxes", correct: true }, // Position 2
      { text: "Interdit de fumer", correct: false },
      { text: "Zone de repos", correct: false },
    ],
  },
  {
    question: "Quel fleuve traverse l'Égypte ?",
    answers: [
      { text: "L'Amazone", correct: false },
      { text: "Le Mississippi", correct: false },
      { text: "Le Nil", correct: true }, // Position 3
      { text: "Le Danube", correct: false },
    ],
  },
];
