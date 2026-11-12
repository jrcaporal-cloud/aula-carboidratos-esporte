/** Slide 101 · 82% dos Ensaios. STELL2014 (61 ECRs, n = 679, placebo de água) e VANDEN2011 (88 estudos). */

export const TOTAL = 61;
export const POSITIVE = 50;

export const LEADS = [
    '61 ensaios randomizados, n = 679. Carboidrato contra placebo de água, em provas de duração variada.',
    '50 ensaios acharam benefício; 11 não acharam mudança.',
    'O ganho cresce com a duração da prova (p = 0,0036). E o mecanismo muda.',
    'Meta-análise de 88 estudos: a formulação decide se o efeito é grande ou prejudicial.',
] as const;

export const MECHANISMS = [
    { when: '~1 h', what: 'boca e cérebro', note: 'tipo e quantidade “irrelevantes”' },
    { when: '> 2 h', what: 'combustível', note: 'entrega e oxidação altas' },
] as const;

export const SOURCES = [
    'Stellingwerff & Cox, Appl Physiol Nutr Metab 2014',
    'Stellingwerff & Cox, Appl Physiol Nutr Metab 2014',
    'Stellingwerff & Cox, Appl Physiol Nutr Metab 2014',
    'Vandenbogaerde & Hopkins, Sports Med 2011',
] as const;
