export type SliderType = {
    icon: string,
    title: string,
    description: string,
    details : string //array de strings
}

export const slider = [
    {
        icon: 'bulb-outline',
        title: 'Vamos lá!',
        description: 'Cada jogo começa com um enunciado que te dá uma dica sobre o código secreto que você precisa desvendar.'
    },
    {
        icon: 'checkmark-circle-outline',
        title: 'Receba o feedback',
        description: 'A cada rodada, o jogo te dirá quantas cartas estão na posição certa e quantas estão certas, mas na posição errada.'
    },
    {
        icon: 'stats-chart-outline',
        title: 'Níveis de dificuldade',
        description: 'O desafio aumenta a cada nível, com menos tentativas e novas cartas sendo adicionadas para te confundir:',
        details: [ //ADICIONAR INFORMACAO SOBRE EMBARALHAMENTO
            'Nível 1: 10 tentativas. A ordem das cartas é reembaralhada.',
            'Nível 2: 8 tentativas. A ordem é reembaralhada e 1 carta nova é adicionada.',
            'Nível 3: 6 tentativas. A ordem é reembaralhada e 2 cartas novas são adicionadas.',
            'Nível 4: 5 tentativas. A ordem é reembaralhada e 3 cartas novas são adicionadas.'
        ]
    },
    {
        icon: 'trophy-outline',
        title: 'Vença e Suba no Ranking!',
        description: 'Acerte o código secreto para finalizar o jogo, ganhar pontos e ver sua posição no seu ranking pessoal.'
    }
]