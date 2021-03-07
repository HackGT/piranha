const BudgetCardData = {
  data: {
    budget: {
      id: 1,
      name: "Spring Budget",
      categories: [
        {
          id: 1,
          name: "Food",
          lineItems: [
            {
              id: 1,
              name: "Dinner",
              quantity: 10,
              unitCost: 100,
              category: {
                id: 1,
                name: "test",
                lineItems: []
              }
            },
            {
              id: 2,
              name: "Lunch",
              quantity: 100,
              unitCost: 30,
              category: {
                id: 1,
                name: "test",
                lineItems: []
              }
            }
          ]
        },
        {
          id: 2,
          name: "Swag",
          lineItems: [
            {
              id: 1,
              name: "Shirts",
              quantity: 500,
              unitCost: 10,
              category: {
                id: 1,
                name: "test",
                lineItems: []
              }
            },
            {
              id: 2,
              name: "Boxes",
              quantity: 1000,
              unitCost: 10,
              category: {
                id: 1,
                name: "test",
                lineItems: []
              }
            }
          ]
        }
      ]
    }
  }
};

export default BudgetCardData;
