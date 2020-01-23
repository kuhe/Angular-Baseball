import { Player } from '../Model/Player';
import { pitches_t } from '../Api/pitches';
import { handedness_t } from '../Api/handedness';
import { player_skill_t } from '../Api/player';

class Trainer {
    public makePlayer(
        player: Player,
        name: string,
        surname: string,
        surnameJ: string,
        nameJ: string,
        pitching: player_skill_t,
        offense: {
            eye: player_skill_t;
            speed: player_skill_t;
            power: player_skill_t;
        },
        defense: {
            throwing: player_skill_t;
            speed: player_skill_t;
            catching: player_skill_t;
            fielding: player_skill_t;
        },
        bats: handedness_t,
        throws: handedness_t,
        number: number
    ): Player {
        player.hero = true;

        if ('rights' && 0) {
            surnameJ = '代表';
            nameJ = '選手';
            name = 'TEAM';
            surname = 'JPN';
        }

        player.name = `${surname} ${name}`;
        player.nameJ = surnameJ + nameJ;
        player.surname = surname;
        player.surnameJ = surnameJ;

        player.spaceName(surnameJ, nameJ);
        player.randomizeSkills(true, true);
        player.skill.offense = offense;
        player.skill.defense = defense;
        player.skill.pitching = pitching;
        player.bats = bats;
        player.throws = throws;
        player.number = number;
        for (const key of Object.keys(player.pitching)) {
            const pitch = player.pitching[key as pitches_t];
            pitch.velocity += (pitching / 5) | 0;
            pitch.break += (pitching / 5) | 0;
            pitch.control += (pitching / 5) | 0;
        }

        player.resetStats(0);

        return player;
    }
}

export { Trainer };
