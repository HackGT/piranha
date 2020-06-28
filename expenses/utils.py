# Processes where input ex. changes {'a': 2, 'b': 3, 'c': {'b': 2, 'd': {'e': 5}}}
# to {'a': 2, 'b': 3, 'c__b': 2, 'c__d__e': 5} to account for Django foreign key queryset
def process_where_input(where_dict):
    new_dict = {}

    for key in where_dict:
        if isinstance(where_dict[key], dict):
            where_dict[key] = process_where_input(where_dict[key])

            for sub_key in where_dict[key]:
                new_dict[key + '__' + sub_key] = where_dict[key][sub_key]

        else:
            new_dict[key] = where_dict[key]

    return new_dict