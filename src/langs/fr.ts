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
    'Results by user': 'Résultats par utilisateur',
    'No users answered the quiz yet':
      "Aucun utilisateur n'a répondu au quiz pour l'instant",
    Analytics: 'Analytique',
    'Quiz performance': 'Performance du quiz',
    'Users performance': 'Performance des utilisateurs',
    'Quiz correct response percentage':
      'Pourcentage de réponses correctes du quiz',
    'Correct responses': 'Réponses correctes',
    'Incorrect responses': 'Réponses incorrectes',
    'Number of correct/incorrect responses per question':
      'Nombre de réponses correctes/incorrectes par question',
    'Number of correct responses': 'Nombre de réponses correctes',
    'Percentage correct responses': 'Pourcentage de réponses correctes',
    'Number of incorrect responses': 'Nombre de réponses incorrectes',
    'Percentage incorrect responses': 'Pourcentage de réponses incorrectes',
    'Number of correct responses per user':
      'Nombre de réponses correctes par utilisateur',
    General: 'Général',
    'Question answer frequency': 'Fréquence des réponses à la question',
    'Answers distribution': 'Distribution des réponses',
    'Number of answers': 'Nombre de réponses',
    'Number of time selected': 'Nombre de fois sélectionné',
    'Percentage number of time selected':
      'Pourcentage du nombre de fois sélectionné',
    'Error, question type unknown': 'Erreur, type de question inconnu',
    'Error, chart type unknown': 'Erreur, type de graphique inconnu',
    blank: 'vide',
    NO_RESPONSE_FOR_NOW: "Il n'y a pas encore de réponse.",
    NO_DATA_FOR_GENERAL_CHARTS:
      "Aucune donnée n'a été trouvé pour les graphiques.",
    ATTEMPTS_PROGRESS_NUMBER_OF_ATTEMPTS: 'Nombre de tentatives',
    CREATE_VIEW_NUMBER_OF_ATTEMPTS: 'Nombre de tentatives',
    MULTIPLE_CHOICE_NOT_CORRECT:
      "La réponse est incorrecte ou n'est pas entièrement correcte.",
    HINTS_TITLE: 'Indices',
    HINTS_SUB_TITLE:
      "Saisissez ici les indices qui s'afficheront si la réponse est incorrecte, afin d'aider l'étudiant",
    HINTS_LABEL: 'Indices',
    HINTS_ALERT_TITLE: "Avez-vous besoins d'indices ?",
    PREV_QUESTION_BTN: 'Précédent',
    NEXT_QUESTION_BTN: 'Suivant',
    QUESTION_STEPPER_TITLE_NO_MORE_ATTEMPTS: 'Plus aucune tentative',
    QUESTION_STEPPER_TITLE_ATTEMPTS:
      '{{current_attempts}} sur {{max_attempts}} tentatives',
  },
};
