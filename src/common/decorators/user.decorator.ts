import { createParamDecorator } from 'type-graphql';

import { Context } from '../types';
import { helpers } from '../utils';

const User = () => createParamDecorator<Context>(({ context }) => helpers.getCurrentUser(context.req));

export default User;
