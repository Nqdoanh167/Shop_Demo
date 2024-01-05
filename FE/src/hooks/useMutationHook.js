/** @format */

import {useMutation} from 'react-query';

export const useMutationHook = (fnCallback) => {
   const mutation = useMutation({
      mutationFn: fnCallback,
   });
   return mutation;
};
