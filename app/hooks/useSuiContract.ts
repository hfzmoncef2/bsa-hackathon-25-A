import { useSignAndExecuteTransactionBlock } from '@mysten/dapp-kit';
import { suiContractService } from './sui-contract';

export const useSuiContract = () => {
  const { mutateAsync: signAndExecute } = useSignAndExecuteTransactionBlock();

  const createInsurancePolicy = async (fieldData: any, premium: number) => {
    return await suiContractService.createInsurancePolicy(fieldData, premium, { mutateAsync: signAndExecute });
  };

  const getPoolStats = async () => {
    return await suiContractService.getPoolStats({ mutateAsync: signAndExecute });
  };

  const submitClaim = async (policyId: string, claimData: any) => {
    return await suiContractService.submitClaim(policyId, claimData);
  };

  return {
    createInsurancePolicy,
    getPoolStats,
    submitClaim,
  };
};

