import bcrypt from 'bcrypt';
import {
    GraphQLNonNull as NonNull,
    GraphQLString as StringType,
} from 'graphql';
import { UserType } from '../types';
import { withMiddlewares, withHandledErrors, transformSequelizeErrors } from '../utils';
import { User } from '@api/models';

export default {
    args: {
        email: { type: new NonNull(StringType) },
        password: { type: new NonNull(StringType) },
    },
    type: new NonNull(UserType.withErrors),
    resolve: withMiddlewares(
        withHandledErrors,
        transformSequelizeErrors,
        async (request, { password, ...args }) => User.create({
            ...args,
            password: await bcrypt.hash(password, 8),
        }),
    ),
};
