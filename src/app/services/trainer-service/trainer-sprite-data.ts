export const trainerSpriteData: { [generation: number]: { [gender: string]: string } } = {
        1: {
            male: 'https://raw.githubusercontent.com/zeroxm/pokemon-roulette-trainer-sprites/refs/heads/main/sprites/Spr_FRLG_Red.png',
            female: 'https://raw.githubusercontent.com/zeroxm/pokemon-roulette-trainer-sprites/refs/heads/main/sprites/Spr_FRLG_Leaf.png'
        },
        2: {
            male: 'https://raw.githubusercontent.com/zeroxm/pokemon-roulette-trainer-sprites/refs/heads/main/sprites/Spr_HGSS_Ethan.png',
            female: 'https://raw.githubusercontent.com/zeroxm/pokemon-roulette-trainer-sprites/refs/heads/main/sprites/Spr_HGSS_Lyra.png'
        },
        3: {
            male: 'https://raw.githubusercontent.com/zeroxm/pokemon-roulette-trainer-sprites/refs/heads/main/sprites/Spr_RS_Brendan.png',
            female: 'https://raw.githubusercontent.com/zeroxm/pokemon-roulette-trainer-sprites/refs/heads/main/sprites/Spr_RS_May.png'
        },
        4: {
            male: 'https://raw.githubusercontent.com/zeroxm/pokemon-roulette-trainer-sprites/refs/heads/main/sprites/Spr_DP_Lucas.png',
            female: 'https://raw.githubusercontent.com/zeroxm/pokemon-roulette-trainer-sprites/refs/heads/main/sprites/Spr_DP_Dawn.png'
        },
        5: {
            male: 'https://raw.githubusercontent.com/zeroxm/pokemon-roulette-trainer-sprites/refs/heads/main/sprites/Spr_BW_Hilbert.png',
            female: 'https://raw.githubusercontent.com/zeroxm/pokemon-roulette-trainer-sprites/refs/heads/main/sprites/Spr_BW_Hilda.png'
        },
        6: {
            male: 'https://raw.githubusercontent.com/zeroxm/pokemon-roulette-trainer-sprites/refs/heads/main/sprites/Spr_Masters_Calem.png',
            female: 'https://raw.githubusercontent.com/zeroxm/pokemon-roulette-trainer-sprites/refs/heads/main/sprites/Spr_Masters_Serena_2.png'
        },
        7: {
            male: 'https://raw.githubusercontent.com/zeroxm/pokemon-roulette-trainer-sprites/refs/heads/main/sprites/Spr_Masters_Elio.png',
            female: 'https://raw.githubusercontent.com/zeroxm/pokemon-roulette-trainer-sprites/refs/heads/main/sprites/Spr_Masters_Selene.png'
        },
        8: {
            male: 'https://raw.githubusercontent.com/zeroxm/pokemon-roulette-trainer-sprites/refs/heads/main/sprites/Spr_Masters_Victor.png',
            female: 'https://raw.githubusercontent.com/zeroxm/pokemon-roulette-trainer-sprites/refs/heads/main/sprites/Spr_Masters_Gloria.png'
        },
        9: {
            male: 'https://raw.githubusercontent.com/zeroxm/pokemon-roulette-trainer-sprites/refs/heads/main/sprites/Spr_Masters_Florian.png',
            female: 'https://raw.githubusercontent.com/zeroxm/pokemon-roulette-trainer-sprites/refs/heads/main/sprites/Spr_Masters_Juliana.png'
        },
        // Insurgence (Torren). The wiki ships the player as a single GIF
        // (`Player.gif`) cycling through 3 hairstyle/outfit pairs (boy + girl
        // side-by-side). For a static character-select we extracted the
        // purple-hair frame and split it into boy/girl halves, bundled as
        // local assets so the asset isn't subject to wiki rate-limiting.
        100: {
            male: 'assets/insurgence/player-boy.png',
            female: 'assets/insurgence/player-girl.png'
        }
    }
