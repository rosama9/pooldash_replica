import { Util } from '~/services/Util';

export namespace ErrorParser {
    export const getUserError = (input: string | null): string | null => {
        if (!input) { return null; }

        const prefix = 'GraphQL error: ';
        if (input.indexOf(prefix) < 0) { return null; }

        const split = input.split(prefix);
        if (split.length <= 1) { return null; }

        const result = Util.removeSuffixIfPresent(']', split[1]);
        return Util.removeSuffixIfPresent('"}', result);
    };
}
