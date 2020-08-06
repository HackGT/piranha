import graphene
import expenses.graphql.Query as expenses_query
import expenses.graphql.Mutation as expenses_mutation
import budgets.graphql.Query as budgets_query


class Query(expenses_query.Query, budgets_query.Query, graphene.ObjectType):
    pass


class Mutation(expenses_mutation.Mutation, graphene.ObjectType):
    pass


schema = graphene.Schema(query=Query, mutation=Mutation)
