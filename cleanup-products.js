const { createClient } = require('@supabase/supabase-js');

const DEFAULT_SUPABASE_URL = 'https://fhyaejmwxesmwbykgnna.supabase.co';
const DEFAULT_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZoeWFlam13eGVzbXdieWtnbm5hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY4MjQ1MTYsImV4cCI6MjEwMjQwMDUxNn0.55UgGwXUil_X2ecIJv2FgvgtH7oUe3_sCrRqjDL9a-M';
const PLACEHOLDER_IMAGES = [
  'https://images.pexels.com/photos/3945653/pexels-photo-3945653.jpeg?auto=compress&cs=tinysrgb&w=1200',
  'https://images.pexels.com/photos/7915356/pexels-photo-7915356.jpeg?auto=compress&cs=tinysrgb&w=1200',
  'https://images.pexels.com/photos/7915357/pexels-photo-7915357.jpeg?auto=compress&cs=tinysrgb&w=1200'
];

const GAMES = [
  { console: 'PS4', name: 'Madden NFL 25', price: 500, condition: 'Used', description: "The latest entry in EA Sports' iconic American football franchise. Features updated rosters, refined gameplay mechanics, and immersive career and franchise modes." },
  { console: 'PS4', name: 'Dynasty Warriors 8: Xtreme Legends Complete Edition', price: 600, condition: 'Used', description: 'Epic hack-and-slash action set in ancient China, cutting through hundreds of enemies at once. Complete Edition bundles all Xtreme Legends DLC.' },
  { console: 'PS4', name: 'Killzone Shadow Fall', price: 500, condition: 'Used', description: "A visually stunning sci-fi FPS and one of the PS4's premier launch titles, featuring a gripping campaign and competitive multiplayer." },
  { console: 'PS4', name: 'Gang Beasts', price: 700, condition: 'Used', description: 'A hilariously chaotic physics-based multiplayer brawler, perfect for local co-op nights.' },
  { console: 'PS4', name: 'DreamWorks All-Star Kart Racing', price: 600, condition: 'Used', description: 'A family-friendly kart racing adventure starring beloved DreamWorks characters.' },
  { console: 'PS4', name: 'Zombi', price: 600, condition: 'Used', description: 'A tense survival horror experience in zombie-overrun London, featuring permadeath mechanics.' },
  { console: 'PS4', name: 'Grand Theft Auto V', price: 800, condition: 'Used', description: 'One of the best-selling games ever made. Explore Los Santos through three interconnected criminal stories.' },
  { console: 'PS4', name: 'Final Fantasy XIV: Heavensward', price: 500, condition: 'Used', description: "The first major expansion for the acclaimed MMORPG. Requires base game to play." },
  { console: 'PS4', name: 'Horizon Zero Dawn', price: 500, condition: 'Used', description: 'An award-winning open-world action RPG following Aloy in a post-apocalyptic world of robotic creatures.' },
  { console: 'PS4', name: 'Horizon Zero Dawn Complete Edition', price: 500, condition: 'Used', description: 'Bundles the base game with the acclaimed Frozen Wilds expansion.' },
  { console: 'PS4', name: 'Farming Simulator 2018', price: 500, condition: 'Used', description: 'A deeply detailed farming simulation with authentic real-world vehicles and equipment.' },
  { console: 'PS4', name: 'Dragon Age: Inquisition', price: 500, condition: 'Used', description: 'An epic fantasy action RPG where your choices shape a war-torn world.' },
  { console: 'PS4', name: 'Nioh 2', price: 500, condition: 'Used', description: 'A brutally challenging action RPG set in a supernatural version of feudal Japan.' },
  { console: 'PS4', name: 'Nioh', price: 500, condition: 'Used', description: 'The original souls-like action RPG set in feudal Japan.' },
  { console: 'PS4', name: 'Resident Evil 4', price: 1100, condition: 'Used', description: 'A landmark survival horror title, remastered for PS4.' },
  { console: 'PS4', name: 'Resident Evil 7', price: 750, condition: 'Used', description: 'A terrifying return to survival horror roots, played entirely in first-person.' },
  { console: 'PS4', name: "The Last of Us Part II", price: 700, condition: 'Used', description: "A gripping, emotionally intense sequel following Ellie's journey of revenge." },
  { console: 'PS4', name: 'The Last of Us Remastered', price: 700, condition: 'Used', description: 'The critically acclaimed original masterpiece, remastered in full HD.' },
  { console: 'PS4', name: 'Dragon Ball Xenoverse 2', price: 550, condition: 'Used', description: 'Create your own custom fighter and battle alongside iconic Dragon Ball characters.' },
  { console: 'PS4', name: 'Watch Dogs 2', price: 500, condition: 'Used', description: 'Hack and explore a vibrant open-world San Francisco as a skilled hacker.' },
  { console: 'PS4', name: 'Watch Dogs', price: 600, condition: 'Used', description: 'The original hacking-driven open-world action game set in Chicago.' },
  { console: 'PS4', name: "Tom Clancy's Ghost Recon Breakpoint Ultimate Edition", price: 550, condition: 'Used', description: "A tactical open-world military shooter with the Ultimate Edition's full content." },
  { console: 'PS4', name: "Tom Clancy's Ghost Recon Wildlands", price: 550, condition: 'Used', description: 'Lead an elite squad through open-world Bolivia, solo or 4-player co-op.' },
  { console: 'PS4', name: "Assassin's Creed Syndicate", price: 600, condition: 'Used', description: "Control twin assassins in Victorian London's Industrial Revolution." },
  { console: 'PS4', name: "Assassin's Creed Odyssey", price: 700, condition: 'Used', description: 'An epic RPG set in Ancient Greece with deep choices and naval combat.' },
  { console: 'PS4', name: 'Assassin\'s Creed Unity', price: 600, condition: 'Used', description: 'Experience the French Revolution in stunning detail through Paris.' },
  { console: 'PS4', name: 'Assassin\'s Creed Origins', price: 700, condition: 'Used', description: 'Journey through Ancient Egypt in this RPG-focused reinvention of the franchise.' },
  { console: 'PS4', name: 'God of War', price: 500, condition: 'Used', description: 'Kratos and Atreus embark on a Norse mythology-driven adventure.' },
  { console: 'PS4', name: 'God of War III Remastered', price: 800, condition: 'Used', description: "The explosive conclusion to Kratos' Greek saga, remastered for PS4." },
  { console: 'PS4', name: 'God of War Ragnarök', price: 1250, condition: 'Used', description: "Epic continuation of Kratos and Atreus' journey through the Nine Realms." },
  { console: 'PS4', name: 'Batman: Arkham Knight', price: 800, condition: 'Used', description: 'The explosive finale of the Arkham series featuring the Batmobile.' },
  { console: 'PS4', name: 'Batman: Return to Arkham', price: 1000, condition: 'Used', description: 'Remastered collection bundling Arkham Asylum and Arkham City.' },
  { console: 'PS4', name: 'Bloodborne', price: 600, condition: 'Used', description: 'A gothic horror action RPG from FromSoftware, known for its punishing difficulty.' },
  { console: 'PS4', name: 'Final Fantasy XV', price: 1000, condition: 'Used', description: "An open-world RPG following Prince Noctis on an epic quest, in a collector's steelbook case." },
  { console: 'PS4', name: 'Dissidia Final Fantasy NT', price: 1400, condition: 'Used', description: 'A team-based fighting game with heroes and villains from across Final Fantasy.' },
  { console: 'PS4', name: 'Hitman: The Complete First Season', price: 1000, condition: 'Used', description: 'The full first season of the stealth-assassination series across exotic locations.' },
  { console: 'PS4', name: 'Mad Max', price: 650, condition: 'Used', description: 'Survive a brutal open-world wasteland, build your war rig, battle raiders.' },
  { console: 'PS4', name: 'Battlefield 1', price: 500, condition: 'Used', description: 'An immersive WWI shooter with large-scale multiplayer battles.' },
  { console: 'PS4', name: "No Man's Sky", price: 700, condition: 'Used', description: 'Explore an infinite procedurally-generated universe.' },
  { console: 'PS4', name: 'Lara Croft and the Temple of Osiris', price: 1000, condition: 'Used', description: 'A co-op focused action-adventure puzzler on an Egyptian quest.' },
  { console: 'PS4', name: 'Sekiro: Shadows Die Twice', price: 2000, condition: 'Used', description: 'A brutally rewarding action game set in feudal Japan with precision sword combat.' },
  { console: 'PS4', name: 'Mortal Kombat X', price: 600, condition: 'Used', description: 'A brutal, fast-paced fighting game with signature finishing moves.' },
  { console: 'PS4', name: 'Red Dead Redemption 2', price: 1000, condition: 'Used', description: 'An open-world epic set in the fading Wild West.' },
  { console: 'PS4', name: "Dead Rising 4: Frank's Big Package", price: 700, condition: 'Used', description: 'Fight zombies with over-the-top weapons in this action-comedy.' },
  { console: 'PS4', name: 'Dishonored 2', price: 500, condition: 'Used', description: 'A stealth-action game with supernatural powers.' },
  { console: 'PS4', name: 'Resident Evil 3', price: 1000, condition: 'Used', description: 'A relentless survival horror remake following Jill Valentine.' },
  { console: 'PS4', name: 'Uncharted 4: A Thief\'s End', price: 600, condition: 'Used', description: "Nathan Drake's final treasure-hunting adventure." },
  { console: 'PS4', name: 'Uncharted: The Nathan Drake Collection', price: 600, condition: 'Used', description: 'Remastered collection of the first three Uncharted games.' },
  { console: 'PS4', name: 'Uncharted: The Lost Legacy', price: 600, condition: 'Used', description: 'A standalone adventure starring Chloe Frazer.' },
  { console: 'PS4', name: 'The Dark Pictures: Man of Medan', price: 600, condition: 'Used', description: 'A tense branching-choice horror game aboard a haunted ghost ship.' },
  { console: 'PS4', name: 'Vikings – Wolves of Midgard', price: 700, condition: 'Used', description: 'A brutal Norse-themed hack-and-slash action RPG.' },
  { console: 'PS4', name: 'Tekken 7', price: 700, condition: 'Used', description: 'The latest mainline entry in the legendary fighting franchise.' },
  { console: 'PS4', name: 'Gran Turismo Sport', price: 500, condition: 'Used', description: 'A realistic racing simulator with competitive online racing.' },
  { console: 'PS4', name: 'Star Wars Battlefront', price: 500, condition: 'Used', description: 'Large-scale Star Wars battles across iconic film locations.' },
  { console: 'PS4', name: 'Life Is Strange 2', price: 1200, condition: 'New (Sealed)', description: 'An emotionally driven narrative adventure following two brothers on the run.' },
  { console: 'PS4', name: 'Knack', price: 600, condition: 'Used', description: "A family-friendly action-platformer, one of the PS4's original launch titles." },
  { console: 'PS4', name: 'Death Stranding', price: 600, condition: 'Used', description: 'A genre-defying game from Hideo Kojima blending exploration and delivery gameplay.' },
  { console: 'PS4', name: 'Schlag den Star – Das 2. Spiel', price: 500, condition: 'Used', description: 'A German party/game-show style multiplayer game.' },
  { console: 'PS4', name: 'Tearaway Unfolded', price: 800, condition: 'Used', description: 'A charming paper-craft platformer with unique controller integration.' },
  { console: 'PS4', name: 'Mafia III', price: 600, condition: 'Used', description: 'An open-world crime drama set in 1968 New Orleans.' },
  { console: 'PS4', name: 'Ratchet & Clank', price: 500, condition: 'Used', description: 'A vibrant action-packed platformer reboot.' },
  { console: 'PS4', name: 'Rayman Legends', price: 600, condition: 'Used', description: 'A gorgeous hand-crafted platformer with iconic music-based levels.' },
  { console: 'PS4', name: 'Pro Evolution Soccer 2015', price: 500, condition: 'Used', description: 'A classic football simulation entry.' },
  { console: 'PS4', name: 'Pro Evolution Soccer 2016', price: 600, condition: 'Used', description: 'A fan-favorite entry with improved ball physics and AI.' },
  { console: 'PS4', name: 'Pro Evolution Soccer 2018', price: 800, condition: 'Used', description: 'Football sim with licensed leagues and refined dribbling.' },
  { console: 'PS4', name: 'Pro Evolution Soccer 2019', price: 1800, condition: 'Used', description: 'A highly regarded entry with official partnerships and enhanced gameplay.' },
  { console: 'PS4', name: 'Pro Evolution Soccer 2021', price: 2000, condition: 'Used', description: 'The final major PES release before the eFootball rebrand.' },
  { console: 'PS4', name: 'FIFA 23', price: 600, condition: 'Used', description: "The last FIFA-branded EA Sports title, with men's and women's football." },
  { console: 'PS4', name: 'FIFA 18', price: 400, condition: 'Used', description: 'Football sim featuring The Journey story mode.' },
  { console: 'PS4', name: 'FIFA 19', price: 400, condition: 'Used', description: 'Football sim featuring UEFA Champions League integration.' },
  { console: 'PS4', name: 'FIFA 16', price: 300, condition: 'Used', description: "A classic entry featuring women's national teams for the first time." },
  { console: 'PS4', name: "Marvel's Spider-Man", price: 900, condition: 'Used', description: 'An open-world superhero epic swinging through New York City.' },
  { console: 'PS4', name: 'Earthfall', price: 700, condition: 'Used', description: 'A four-player co-op survival shooter battling an alien invasion.' },
  { console: 'PS4', name: 'Left Alive: Day One Edition', price: 700, condition: 'Used', description: 'A survival action game blending stealth and tactical combat.' },
  { console: 'PS4', name: 'Dungeons', price: 500, condition: 'Used', description: 'A dungeon-management strategy game where you play as the villain.' },
  { console: 'PS4', name: 'The Walking Dead', price: 700, condition: 'Used', description: 'A story-driven narrative adventure following Lee and Clementine.' },
  { console: 'PS4', name: 'ARK: Survival Evolved', price: 600, condition: 'Used', description: 'Survive, build, and tame dinosaurs in this massive open-world survival game.' },
  { console: 'PS4', name: 'Knowledge Is Power', price: 500, condition: 'Used', description: 'A family-friendly party trivia game using mobile devices as controllers.' },
  { console: 'PS4', name: 'Road Rage', price: 600, condition: 'Used', description: 'A biker-gang action racing game with vehicular combat.' },
  { console: 'PS4', name: 'Little Nightmares II', price: 700, condition: 'Used', description: 'A haunting atmospheric puzzle-platformer.' },
  { console: 'PS4', name: 'Need for Speed (2015)', price: 500, condition: 'Used', description: 'A reboot of the iconic racing series with immersive story.' },
  { console: 'PS4', name: 'Need for Speed Rivals', price: 500, condition: 'Used', description: 'High-speed police-vs-racer action.' },
  { console: 'PS4', name: 'Need for Speed Heat', price: 800, condition: 'Used', description: 'Race by day, evade police by night in this stylish street racing game.' },
  { console: 'PS4', name: 'The Crew 2', price: 500, condition: 'Used', description: 'An open-world racing game with cars, boats, and planes.' },
  { console: 'PS4', name: 'Far Cry 5', price: 500, condition: 'Used', description: 'An open-world FPS set in rural Montana battling a doomsday cult.' },
  { console: 'PS4', name: 'Middle-earth: Shadow of War', price: 700, condition: 'Used', description: 'An action RPG featuring the innovative Nemesis system.' },
  { console: 'PS4', name: 'Disney Infinity 3.0: Star Wars', price: 500, condition: 'Used', description: 'A toys-to-life adventure with Star Wars characters.' },
  { console: 'PS4', name: "PlayerUnknown's Battlegrounds", price: 500, condition: 'Used', description: 'The battle royale genre pioneer.' },
  { console: 'PS4', name: 'Sleeping Dogs: Definitive Edition', price: 800, condition: 'Used', description: "An open-world action game in Hong Kong's criminal underworld." },
  { console: 'PS4', name: 'WWE 2K23', price: 700, condition: 'Used', description: 'The latest WWE wrestling simulation with an extensive roster.' },
  { console: 'PS4', name: 'WWE 2K16', price: 900, condition: 'Used', description: 'A classic wrestling entry with a large roster of legends.' },
  { console: 'PS4', name: 'Mortal Kombat XL', price: 600, condition: 'Used', description: 'The complete edition including all DLC characters.' },
  { console: 'PS4', name: 'Call of Duty: Modern Warfare Remastered', price: 700, condition: 'Used', description: 'The classic 2007 campaign remastered.' },
  { console: 'PS4', name: 'Call of Duty: Black Ops IIII', price: 500, condition: 'Used', description: 'A multiplayer-focused entry featuring Blackout battle royale.' },
  { console: 'PS4', name: 'Call of Duty: WWII', price: 600, condition: 'Used', description: 'A return to boots-on-the-ground WWII combat.' },
  { console: 'PS5', name: 'Mortal Kombat 1', price: 1000, condition: 'Used', description: 'A complete reimagining of the iconic fighting franchise.' },
  { console: 'PS5', name: 'Alan Wake 2 — Deluxe Edition', price: 2300, condition: 'Used', description: 'A survival horror sequel with psychological thriller storytelling.' },
  { console: 'PS5', name: "Marvel's Spider-Man 2", price: 1800, condition: 'Used', description: 'Swing through New York as Peter Parker and Miles Morales.' },
  { console: 'PS5', name: 'Minecraft', price: 1300, condition: 'Used', description: 'The legendary sandbox survival-building game.' },
  { console: 'PS5', name: 'God of War Ragnarök', price: 1400, condition: 'Used', description: "Kratos and Atreus' epic Norse saga, in enhanced PS5 visuals." },
  { console: 'PS5', name: 'Resident Evil Village', price: 1000, condition: 'Used', description: 'A first-person survival horror thriller following Ethan Winters.' },
  { console: 'PS5', name: 'Tekken 8', price: 1600, condition: 'Used', description: 'The latest mainline entry with next-gen visuals.' },
  { console: 'PS5', name: 'Mafia: The Old Country', price: 2000, condition: 'Used', description: 'A prequel exploring the origins of organized crime in Sicily.' },
  { console: 'PS5', name: 'Gran Turismo 5', price: 500, condition: 'Used', description: 'A landmark racing simulator with realistic physics.' },
  { console: 'PS5', name: 'The Last of Us', price: 600, condition: 'Used', description: 'The original acclaimed post-apocalyptic survival story.' },
  { console: 'PS5', name: 'Grand Theft Auto: San Andreas', price: 1500, condition: 'Used', description: 'The classic open-world crime epic following CJ.' },
  { console: 'PS5', name: 'WWE SmackDown vs. Raw 2008', price: 1000, condition: 'Used', description: 'A classic wrestling entry with Ultimate Championship Mode.' },
  { console: 'PS5', name: 'WWE SmackDown vs. Raw 2010', price: 1000, condition: 'Used', description: 'A fan-favorite featuring Road to WrestleMania mode.' },
  { console: 'PS5', name: 'The Amazing Spider-Man', price: 1000, condition: 'Used', description: 'An open-world superhero game with web-swinging traversal.' },
  { console: 'PS5', name: 'Sports Champions 2', price: 500, condition: 'Used', description: 'A motion-controlled sports compilation.' },
  { console: 'PS5', name: 'PES 2014', price: 300, condition: 'Used', description: 'A classic football simulation entry.' },
  { console: 'PS5', name: 'SingStar: Take That', price: 300, condition: 'Used', description: 'A karaoke party game with Take That hit songs.' },
  { console: 'PS5', name: 'Grand Theft Auto V', price: 500, condition: 'Used', description: 'One of the best-selling games ever made, set in Los Santos.' },
  { console: 'PS5', name: 'Sports Champions', price: 500, condition: 'Used', description: 'A motion-controlled sports compilation.' },
  { console: 'PS5', name: 'Zumba Fitness', price: 400, condition: 'Used', description: 'A dance-fitness game bringing Zumba home.' },
  { console: 'PS5', name: '2010 FIFA World Cup South Africa', price: 500, condition: 'Used', description: 'An official World Cup football simulation.' },
  { console: 'PS5', name: 'PES 2013', price: 500, condition: 'Used', description: 'A classic entry in the football series.' },
  { console: 'PS5', name: 'Killzone 3', price: 500, condition: 'Used', description: 'A sci-fi FPS continuing the Helghast war.' },
  { console: 'PS5', name: 'Angry Birds Star Wars', price: 600, condition: 'Used', description: 'Physics-based puzzle game with the Star Wars universe.' },
  { console: 'PS5', name: 'Dragon Age: Inquisition', price: 400, condition: 'Used', description: 'An epic fantasy action RPG.' },
  { console: 'PS5', name: 'Tekken Hybrid', price: 500, condition: 'Used', description: 'A bundle featuring Tekken 6, Tag Tournament HD, and animated film.' },
  { console: 'PS5', name: 'The Cursed Crusade', price: 1000, condition: 'Used', description: 'An action game set during the Crusades.' },
  { console: 'PS5', name: 'Resistance 2', price: 400, condition: 'Used', description: "A sci-fi FPS continuing humanity's fight against invasion." },
  { console: 'PS5', name: 'Resistance 3', price: 800, condition: 'Used', description: 'The conclusion to the Resistance trilogy.' },
  { console: 'PS5', name: 'Call of Duty: Modern Warfare 3', price: 500, condition: 'Used', description: 'A fast-paced military shooter.' },
  { console: 'PS5', name: 'inFAMOUS 2', price: 500, condition: 'Used', description: 'An open-world superhero action game with electric powers.' },
  { console: 'PS5', name: "Assassin's Creed: Brotherhood", price: 500, condition: 'Used', description: "Ezio's story continues in Renaissance Rome." },
  { console: 'PS5', name: 'Midnight Club: Los Angeles – Complete Edition', price: 800, condition: 'Used', description: 'An open-world street racing game in LA.' },
  { console: 'PS5', name: 'Tomb Raider', price: 500, condition: 'Used', description: 'The gritty reboot following a young Lara Croft.' },
  { console: 'PS5', name: 'Twisted Metal', price: 1500, condition: 'Used', description: 'Chaotic vehicular combat with armored cars.' },
  { console: 'PS5', name: 'Fight Night Round 3', price: 500, condition: 'Used', description: 'A realistic boxing simulation.' },
  { console: 'PS5', name: 'Mafia II', price: 500, condition: 'Used', description: 'A cinematic crime drama set in the 1940s-50s.' },
  { console: 'PS5', name: 'Metal Gear Rising: Revengeance', price: 500, condition: 'Used', description: 'A fast-paced hack-and-slash starring Raiden.' },
  { console: 'PS5', name: 'Far Cry 3', price: 500, condition: 'Used', description: 'The open-world shooter set on a lawless tropical island.' },
  { console: 'PS5', name: 'God of War III', price: 500, condition: 'Used', description: "The explosive original conclusion to Kratos' war against the gods." },
  { console: 'PS5', name: 'Battlefield 3', price: 500, condition: 'Used', description: 'A large-scale military shooter with destructible environments.' },
  { console: 'PS5', name: "WWE '13", price: 500, condition: 'Used', description: 'A wrestling simulation featuring the Attitude Era story mode.' },
  { console: 'PS5', name: 'SoulCalibur V', price: 500, condition: 'Used', description: 'A weapon-based fighting game with fluid combat.' },
  { console: 'PS5', name: 'SoulCalibur IV', price: 500, condition: 'Used', description: 'A classic entry in the weapon-based fighting series.' },
  { console: 'PS5', name: 'Grand Theft Auto IV', price: 800, condition: 'Used', description: 'A gritty story-driven open-world crime game in Liberty City.' },
  { console: 'PS5', name: "Uncharted 3: Drake's Deception", price: 500, condition: 'Used', description: "Nathan Drake's cinematic treasure-hunting adventure." },
  { console: 'PS5', name: 'Uncharted 2: Among Thieves', price: 500, condition: 'Used', description: 'One of the greatest action-adventure games ever made.' },
  { console: 'PS5', name: 'Assassin\'s Creed III', price: 500, condition: 'Used', description: 'Set during the American Revolution.' },
  { console: 'PS5', name: 'Call of Duty: World at War', price: 500, condition: 'Used', description: 'A gritty WWII shooter.' },
  { console: 'PS5', name: 'Call of Duty: Black Ops', price: 500, condition: 'Used', description: 'A Cold War-era shooter with acclaimed Zombies mode.' },
  { console: 'PS5', name: 'Ice Age: Dawn of the Dinosaurs', price: 500, condition: 'Used', description: 'A family-friendly platformer based on the film.' },
  { console: 'PS5', name: 'My Fitness Coach Club', price: 300, condition: 'Used', description: 'A motion-based home fitness game.' },
  { console: 'PS5', name: 'Virtua Fighter 5', price: 500, condition: 'Used', description: 'A technical 3D fighting game.' },
  { console: 'PS5', name: "Assassin's Creed", price: 500, condition: 'Used', description: 'The game that started the franchise.' },
  { console: 'PS5', name: 'Spider-Man: Edge of Time', price: 4000, condition: 'Used', description: 'A time-bending superhero game with dual protagonists.' },
  { console: 'PS5', name: 'Metro: Last Light – Complete Edition', price: 500, condition: 'Used', description: "A post-apocalyptic FPS in Moscow's metro tunnels." },
  { console: 'PS5', name: 'WRC: FIA World Rally Championship', price: 500, condition: 'Used', description: 'An official rally racing simulation.' },
  { console: 'PS5', name: "Assassin's Creed: Revelations", price: 500, condition: 'Used', description: "Ezio's final chapter in Constantinople." },
  { console: 'PS5', name: 'PES 2008', price: 500, condition: 'Used', description: 'A classic football simulation entry.' },
  { console: 'PS5', name: 'PES 2016', price: 500, condition: 'Used', description: 'A fan-favorite football simulation.' },
  { console: 'PS5', name: 'FIFA 19 Legacy Edition', price: 1000, condition: 'Used', description: 'Football sim with UEFA Champions League integration.' },
  { console: 'PS5', name: 'Skylanders SWAP Force', price: 500, condition: 'Used', description: 'A toys-to-life platforming adventure.' },
  { console: 'PS5', name: 'Winning Eleven 2011', price: 500, condition: 'Used', description: 'A classic football simulation.' },
  { console: 'PS5', name: 'FIFA 18 Legacy Edition', price: 500, condition: 'Used', description: 'Football sim featuring The Journey story mode.' },
  { console: 'PS5', name: 'Red Dead Redemption', price: 800, condition: 'Used', description: 'The original Wild West epic.' },
  { console: 'PS5', name: 'Splinter Cell: Double Agent', price: 500, condition: 'Used', description: 'A stealth-action game following Sam Fisher.' },
  { console: 'PS5', name: 'Shellshock 2: Blood Trails', price: 500, condition: 'Used', description: 'A horror-tinged FPS set during the Vietnam War.' },
  { console: 'PS5', name: 'Heavenly Sword', price: 700, condition: 'Used', description: 'A cinematic hack-and-slash with a warrior princess.' },
  { console: 'PS5', name: 'GRID Autosport', price: 600, condition: 'Used', description: 'A competitive racing simulation.' },
  { console: 'PS5', name: 'Ratchet & Clank: Tools of Destruction', price: 500, condition: 'Used', description: 'A classic platform-shooter adventure.' },
  { console: 'PS5', name: 'FIFA 16', price: 250, condition: 'Used', description: "A classic entry featuring women's national teams." },
  { console: 'PS5', name: 'FIFA 14', price: 250, condition: 'Used', description: 'A classic football simulation entry.' },
  { console: 'PS5', name: 'FIFA 13', price: 250, condition: 'Used', description: 'A classic football simulation entry.' },
  { console: 'PS5', name: 'PES 2011', price: 300, condition: 'Used', description: 'A classic entry in the Pro Evolution Soccer series.' },
  { console: 'PS5', name: 'FIFA 12', price: 400, condition: 'Used', description: 'A classic football simulation entry.' },
  { console: 'PS5', name: 'PES 2015', price: 350, condition: 'Used', description: 'A well-regarded entry with refined gameplay.' },
  { console: 'PS5', name: 'PES 2012', price: 350, condition: 'Used', description: 'A classic entry in the football series.' },
  { console: 'PS5', name: 'Ice Age 3: Dawn of the Dinosaurs', price: 700, condition: 'Used', description: 'A family-friendly platformer based on the film.' },
  { console: 'PS5', name: 'Disney/Pixar Cars: Mater-National', price: 600, condition: 'Used', description: 'A kart-racing adventure with Cars film characters.' },
  { console: 'PS5', name: 'Shrek SuperSlam', price: 500, condition: 'Used', description: 'A cartoon-style fighting game with Shrek characters.' },
  { console: 'PS5', name: 'Pro Evolution Soccer 2008', price: 500, condition: 'Used', description: 'A classic entry in the football simulation series.' },
  { console: 'PS5', name: 'World Tour Soccer 2', price: 450, condition: 'Used', description: 'A football simulation with international competition modes.' },
  { console: 'PS5', name: 'Wipeout', price: 450, condition: 'Used', description: 'A futuristic anti-gravity racing game with combat racing.' },
  { console: 'PS5', name: 'Grand Theft Auto: Liberty City Stories', price: 1500, condition: 'Used', description: 'A prequel set in Liberty City.' },
  { console: 'PS5', name: 'LEGO Batman: The Video Game', price: 700, condition: 'Used', description: 'A family-friendly action-adventure with LEGO Batman.' },
  { console: 'PS5', name: 'Street Fighter IV', price: 500, condition: 'Used', description: 'A landmark fighting game revival with deep, accessible combat.' }
];

function normalizeCondition(raw) {
  const value = String(raw || '').trim();
  if (!value) return 'Used';
  const normalized = value.replace(/\s+/g, ' ');
  if (normalized === 'New Sealed' || normalized === 'New (Sealed)' || normalized === 'New sealed') return 'New (Sealed)';
  if (normalized === 'New') return 'New';
  if (normalized === 'Used' || normalized.startsWith('Used')) return 'Used';
  if (normalized === 'New (Sealed)') return 'New (Sealed)';
  return 'Used';
}

function toPrice(value) {
  const numeric = Number(String(value).match(/\d+(?:\.\d+)?/));
  return Number.isFinite(numeric) ? Number(numeric.toFixed(2)) : 0;
}

function buildProduct({ name, console, price, condition, description }) {
  return {
    name,
    console,
    category: 'Games',
    condition: normalizeCondition(condition),
    price: toPrice(price),
    description,
    images: PLACEHOLDER_IMAGES,
    status: 'available'
  };
}

function getSupabaseClient() {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || DEFAULT_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_ANON_KEY;

  return createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  });
}

async function getAllProducts(supabase) {
  const { data, error } = await supabase
    .from('products')
    .select('id, name, console, category, condition, price, status')
    .order('created_at', { ascending: true });

  if (error) {
    throw error;
  }

  return data || [];
}

async function insertMissingProducts(supabase) {
  const existing = await getAllProducts(supabase);
  const results = {
    inserted: [],
    skipped: [],
    failed: []
  };

  for (const game of GAMES) {
    const candidate = buildProduct(game);
    const alreadyExists = existing.some((item) => {
      const sameName = (item.name || '').trim().toLowerCase() === candidate.name.trim().toLowerCase();
      const sameConsole = (item.console || '').trim().toLowerCase() === candidate.console.trim().toLowerCase();
      return sameName && sameConsole;
    });

    if (alreadyExists) {
      results.skipped.push(`${candidate.name} (${candidate.console})`);
      continue;
    }

    const { error } = await supabase
      .from('products')
      .insert([candidate]);

    if (error) {
      results.failed.push({ game: `${candidate.name} (${candidate.console})`, error: error.message });
    } else {
      results.inserted.push(`${candidate.name} (${candidate.console})`);
    }
  }

  return results;
}

async function main() {
  const supabase = getSupabaseClient();
  console.log('Checking database and preparing requested PS4/PS5 Game catalog additions...');

  try {
    const results = await insertMissingProducts(supabase);
    console.log(`\nTotal requested games: ${GAMES.length}`);
    console.log(`Inserted successfully: ${results.inserted.length}`);
    console.log(`Skipped because already present: ${results.skipped.length}`);
    console.log(`Failed to add: ${results.failed.length}`);

    if (results.inserted.length > 0) {
      console.log('\nInserted games:');
      results.inserted.forEach((item) => console.log(`- ${item}`));
    }

    if (results.failed.length > 0) {
      console.log('\nFailed games:');
      results.failed.forEach(({ game, error }) => console.log(`- ${game}: ${error}`));
    }

    if (results.skipped.length > 0) {
      console.log('\nExisting items left alone (not deleted):');
      results.skipped.slice(0, 10).forEach((item) => console.log(`- ${item}`));
      if (results.skipped.length > 10) console.log(`... and ${results.skipped.length - 10} more`);
    }
  } catch (error) {
    console.error('Unable to read or write products table.');
    console.error(error);
    process.exitCode = 1;
  }
}

main();
