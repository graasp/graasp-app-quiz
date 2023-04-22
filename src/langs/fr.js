import { FAILURE_MESSAGES } from '../config/constants';

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  translations: {
    'Answer Type': 'Type de la réponse',
    'Multiple Choices': 'Réponse à choix multiples',
    'Text Input': 'Texte',
    Slider: 'Slider',
    Question: 'Question',
    'Enter Question': 'Entrer une question',
    Previous: 'Précédent',
    Delete: 'Supprimer',
    Save: 'Sauvegarder',
    Prev: 'Précédent',
    Next: 'Suivant',
    Submit: 'Envoyer',
    'Type your answer': 'Entrer la réponse',
    'Correct Answer': 'Réponse correcte: {{answer}}',
    Answer: 'Réponse',
    'Answer nb': 'Réponse: {{nb}}',
    Answers: 'Réponses',
    'Add Answer': 'Ajouter une réponse',
    Maximum: 'Maximum',
    Minimum: 'Minimum',
    'Slide the cursor to the correct value':
      'Déplacer le curseur sur la réponse correcte',
    'Add a new question': 'Ajouter une nouvelle question',
    [FAILURE_MESSAGES.EMPTY_QUESTION]: 'La question ne peut pas être vide',
    [FAILURE_MESSAGES.SLIDER_MIN_SMALLER_THAN_MAX]:
      'La valeur minimum doit être plus petite que la valeur maximale',
    [FAILURE_MESSAGES.SLIDER_UNDEFINED_MIN_MAX]:
      'Les valeurs maximales et minimales doivent être définies',
    [FAILURE_MESSAGES.MULTIPLE_CHOICES_ANSWER_COUNT]:
      'Au moins 2 réponses doivent être proposées',
    [FAILURE_MESSAGES.MULTIPLE_CHOICES_CORRECT_ANSWER]:
      'Au moins une réponse doit être correcte',
    [FAILURE_MESSAGES.MULTIPLE_CHOICES_EMPTY_CHOICE]:
      'Une réponse ne peut pas être vide',
    [FAILURE_MESSAGES.TEXT_INPUT_NOT_EMPTY]: 'La réponse ne peut pas être vide',
    'Create Quiz': 'Créer un quiz',
    Results: 'Résultats',
    User: 'Utilisateur',
    Date: 'Date',
    Correct: 'Correcte',
    'Not yet answered': 'Pas encore répondu',
    'sorted descending': 'trié par ordre décroissant',
    'sorted ascending': 'trié par ordre croissant',
    "There isn't any question to display":
      "Il n'y a aucune questions à afficher",
    'Results by question': 'Résultats par question',
    'Results by user': 'Résultatsj par utilisateur',
  },
};
