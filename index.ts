import { Engine, Rule } from 'json-rules-engine';
let engine = new Engine();

type customRule = {
  all: {
    fact: string,
    operator: string,
    value: string | number | number[] | string[],
    factResult?: string | number,
    result?: boolean,
  }[],
}

const mapping = {
  greaterThanInclusive: '>=',
  greaterThan: '>',
  lessThanInclusive: '<=',
  lessThan: '<',
  equal: '==',
};

const articles = [
  { nom: 'viande1', cat: 'viande', prix: 10 },
  { nom: 'viande2', cat: 'viande', prix: 5 },
  { nom: 'legume1', cat: 'legume', prix: 12 }
];

const conditions: customRule = {
  //any: [{
    all: [{
      fact: 'nombreViandes',
      operator: 'greaterThanInclusive',
//        value: 2,
      value: 3,
    },
    {
      fact: 'prixTotalViandes',
      operator: 'greaterThanInclusive',
      value: 14,        
    //}],
  },
  {
    fact: 'prixTotalViandes',
    operator: 'in',
    value: []
  }
/*{
  fact: 'prixTotal',
  operator: 'greaterThanInclusive',
  value: 30,   
}*/],
}

const rule = {
  conditions,
  event: {
    type: 'coupon',
    params: {
      message: 'Le coupon peut être généré!'
    }
  }
}

engine.addRule(rule);

let facts = {
  nombreViandes: articles.filter(article => article.cat === 'viande').length,
  prixTotalViandes: articles.filter(article => article.cat === 'viande').reduce((acc, article) => acc + article.prix, 0),
  prixTotal: articles.reduce((acc, article) => acc + article.prix, 0),
}

engine
  .run(facts)
  .then(results => {
    results.events.map(event => console.log(event.params.message))
  })
  .catch(err => console.warn('err:', err));

// const jsonString = (new Rule(rule)).toJSON();
// console.log(jsonString);

engine.on('failure', function(event, almanac, ruleResult) {
(ruleResult.conditions as customRule).all.forEach(el => {
  console.log(el.fact, mapping[el.operator] || el.operator, el.value, '?', el.factResult, '-', el.result);
});
});

// Output: {"conditions":{"priority":1,"any":[{"priority":1,"all":[{"operator":"greaterThanInclusive","value":2,"fact":"nombreViandes"},{"operator":"greaterThanInclusive","value":14,"fact":"prixTotalViandes"}]},{"operator":"greaterThanInclusive","value":30,"fact":"prixTotal"}]},"priority":1,"event":{"type":"coupon","params":{"message":"Le coupon peut être généré!"}}}