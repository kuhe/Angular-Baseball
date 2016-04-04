import { Iterator } from '../Services/Iterator';

class Trainer {
    makePlayer(player, name, surname, surnameJ, nameJ, pitching, offense, defense, bats, throws, number) {
        player.hero = true;

        if ('rights' && 0) {
            surnameJ = '代表';
            nameJ =  '選手';
            name = 'TEAM';
            surname = 'JPN';
        }

        player.name = name + ' ' + surname;
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
        Iterator.each(player.pitching, function(key, value) {
            player.pitching[key].velocity += pitching/5 | 0;
            player.pitching[key].break += pitching/5 | 0;
            player.pitching[key].control += pitching/5 | 0;
        });
        player.resetStats(0);
    }
}

export { Trainer }