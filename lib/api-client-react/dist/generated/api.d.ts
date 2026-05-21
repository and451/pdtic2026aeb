import type { QueryKey, UseMutationOptions, UseMutationResult, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import type { DashboardSummary, HealthStatus, KeyResult, KeyResultInput, KeyResultUpdate, Kpi, KpiInput, KpiUpdate, ListNecessidadesParams, Necessidade, NecessidadeInput, NecessidadeUpdate, NecessidadesStats, Okr, OkrInput, OkrUpdate, OkrWithKeyResults } from './api.schemas';
import { customFetch } from '../custom-fetch';
import type { ErrorType, BodyType } from '../custom-fetch';
type AwaitedInput<T> = PromiseLike<T> | T;
type Awaited<O> = O extends AwaitedInput<infer T> ? T : never;
type SecondParameter<T extends (...args: never) => unknown> = Parameters<T>[1];
export declare const getHealthCheckUrl: () => string;
/**
 * Returns server health status
 * @summary Health check
 */
export declare const healthCheck: (options?: RequestInit) => Promise<HealthStatus>;
export declare const getHealthCheckQueryKey: () => readonly ["/api/healthz"];
export declare const getHealthCheckQueryOptions: <TData = Awaited<ReturnType<typeof healthCheck>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData> & {
    queryKey: QueryKey;
};
export type HealthCheckQueryResult = NonNullable<Awaited<ReturnType<typeof healthCheck>>>;
export type HealthCheckQueryError = ErrorType<unknown>;
/**
 * @summary Health check
 */
export declare function useHealthCheck<TData = Awaited<ReturnType<typeof healthCheck>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getListNecessidadesUrl: (params?: ListNecessidadesParams) => string;
/**
 * @summary Listar todas as necessidades de TIC
 */
export declare const listNecessidades: (params?: ListNecessidadesParams, options?: RequestInit) => Promise<Necessidade[]>;
export declare const getListNecessidadesQueryKey: (params?: ListNecessidadesParams) => readonly ["/api/necessidades", ...ListNecessidadesParams[]];
export declare const getListNecessidadesQueryOptions: <TData = Awaited<ReturnType<typeof listNecessidades>>, TError = ErrorType<unknown>>(params?: ListNecessidadesParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listNecessidades>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listNecessidades>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListNecessidadesQueryResult = NonNullable<Awaited<ReturnType<typeof listNecessidades>>>;
export type ListNecessidadesQueryError = ErrorType<unknown>;
/**
 * @summary Listar todas as necessidades de TIC
 */
export declare function useListNecessidades<TData = Awaited<ReturnType<typeof listNecessidades>>, TError = ErrorType<unknown>>(params?: ListNecessidadesParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listNecessidades>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getCreateNecessidadeUrl: () => string;
/**
 * @summary Criar nova necessidade de TIC
 */
export declare const createNecessidade: (necessidadeInput: NecessidadeInput, options?: RequestInit) => Promise<Necessidade>;
export declare const getCreateNecessidadeMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createNecessidade>>, TError, {
        data: BodyType<NecessidadeInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof createNecessidade>>, TError, {
    data: BodyType<NecessidadeInput>;
}, TContext>;
export type CreateNecessidadeMutationResult = NonNullable<Awaited<ReturnType<typeof createNecessidade>>>;
export type CreateNecessidadeMutationBody = BodyType<NecessidadeInput>;
export type CreateNecessidadeMutationError = ErrorType<unknown>;
/**
* @summary Criar nova necessidade de TIC
*/
export declare const useCreateNecessidade: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createNecessidade>>, TError, {
        data: BodyType<NecessidadeInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof createNecessidade>>, TError, {
    data: BodyType<NecessidadeInput>;
}, TContext>;
export declare const getGetNecessidadesStatsUrl: () => string;
/**
 * @summary Estatísticas das necessidades por status e MoSCoW
 */
export declare const getNecessidadesStats: (options?: RequestInit) => Promise<NecessidadesStats>;
export declare const getGetNecessidadesStatsQueryKey: () => readonly ["/api/necessidades/stats"];
export declare const getGetNecessidadesStatsQueryOptions: <TData = Awaited<ReturnType<typeof getNecessidadesStats>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getNecessidadesStats>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getNecessidadesStats>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetNecessidadesStatsQueryResult = NonNullable<Awaited<ReturnType<typeof getNecessidadesStats>>>;
export type GetNecessidadesStatsQueryError = ErrorType<unknown>;
/**
 * @summary Estatísticas das necessidades por status e MoSCoW
 */
export declare function useGetNecessidadesStats<TData = Awaited<ReturnType<typeof getNecessidadesStats>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getNecessidadesStats>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getGetNecessidadeUrl: (id: number) => string;
/**
 * @summary Obter necessidade por ID
 */
export declare const getNecessidade: (id: number, options?: RequestInit) => Promise<Necessidade>;
export declare const getGetNecessidadeQueryKey: (id: number) => readonly [`/api/necessidades/${number}`];
export declare const getGetNecessidadeQueryOptions: <TData = Awaited<ReturnType<typeof getNecessidade>>, TError = ErrorType<void>>(id: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getNecessidade>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getNecessidade>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetNecessidadeQueryResult = NonNullable<Awaited<ReturnType<typeof getNecessidade>>>;
export type GetNecessidadeQueryError = ErrorType<void>;
/**
 * @summary Obter necessidade por ID
 */
export declare function useGetNecessidade<TData = Awaited<ReturnType<typeof getNecessidade>>, TError = ErrorType<void>>(id: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getNecessidade>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getUpdateNecessidadeUrl: (id: number) => string;
/**
 * @summary Atualizar necessidade de TIC
 */
export declare const updateNecessidade: (id: number, necessidadeUpdate: NecessidadeUpdate, options?: RequestInit) => Promise<Necessidade>;
export declare const getUpdateNecessidadeMutationOptions: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateNecessidade>>, TError, {
        id: number;
        data: BodyType<NecessidadeUpdate>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof updateNecessidade>>, TError, {
    id: number;
    data: BodyType<NecessidadeUpdate>;
}, TContext>;
export type UpdateNecessidadeMutationResult = NonNullable<Awaited<ReturnType<typeof updateNecessidade>>>;
export type UpdateNecessidadeMutationBody = BodyType<NecessidadeUpdate>;
export type UpdateNecessidadeMutationError = ErrorType<void>;
/**
* @summary Atualizar necessidade de TIC
*/
export declare const useUpdateNecessidade: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateNecessidade>>, TError, {
        id: number;
        data: BodyType<NecessidadeUpdate>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof updateNecessidade>>, TError, {
    id: number;
    data: BodyType<NecessidadeUpdate>;
}, TContext>;
export declare const getDeleteNecessidadeUrl: (id: number) => string;
/**
 * @summary Remover necessidade de TIC
 */
export declare const deleteNecessidade: (id: number, options?: RequestInit) => Promise<void>;
export declare const getDeleteNecessidadeMutationOptions: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteNecessidade>>, TError, {
        id: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof deleteNecessidade>>, TError, {
    id: number;
}, TContext>;
export type DeleteNecessidadeMutationResult = NonNullable<Awaited<ReturnType<typeof deleteNecessidade>>>;
export type DeleteNecessidadeMutationError = ErrorType<void>;
/**
* @summary Remover necessidade de TIC
*/
export declare const useDeleteNecessidade: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteNecessidade>>, TError, {
        id: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof deleteNecessidade>>, TError, {
    id: number;
}, TContext>;
export declare const getListOkrsUrl: () => string;
/**
 * @summary Listar OKRs
 */
export declare const listOkrs: (options?: RequestInit) => Promise<OkrWithKeyResults[]>;
export declare const getListOkrsQueryKey: () => readonly ["/api/okrs"];
export declare const getListOkrsQueryOptions: <TData = Awaited<ReturnType<typeof listOkrs>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listOkrs>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listOkrs>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListOkrsQueryResult = NonNullable<Awaited<ReturnType<typeof listOkrs>>>;
export type ListOkrsQueryError = ErrorType<unknown>;
/**
 * @summary Listar OKRs
 */
export declare function useListOkrs<TData = Awaited<ReturnType<typeof listOkrs>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listOkrs>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getCreateOkrUrl: () => string;
/**
 * @summary Criar novo OKR
 */
export declare const createOkr: (okrInput: OkrInput, options?: RequestInit) => Promise<Okr>;
export declare const getCreateOkrMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createOkr>>, TError, {
        data: BodyType<OkrInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof createOkr>>, TError, {
    data: BodyType<OkrInput>;
}, TContext>;
export type CreateOkrMutationResult = NonNullable<Awaited<ReturnType<typeof createOkr>>>;
export type CreateOkrMutationBody = BodyType<OkrInput>;
export type CreateOkrMutationError = ErrorType<unknown>;
/**
* @summary Criar novo OKR
*/
export declare const useCreateOkr: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createOkr>>, TError, {
        data: BodyType<OkrInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof createOkr>>, TError, {
    data: BodyType<OkrInput>;
}, TContext>;
export declare const getGetOkrUrl: (id: number) => string;
/**
 * @summary Obter OKR por ID
 */
export declare const getOkr: (id: number, options?: RequestInit) => Promise<OkrWithKeyResults>;
export declare const getGetOkrQueryKey: (id: number) => readonly [`/api/okrs/${number}`];
export declare const getGetOkrQueryOptions: <TData = Awaited<ReturnType<typeof getOkr>>, TError = ErrorType<void>>(id: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getOkr>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getOkr>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetOkrQueryResult = NonNullable<Awaited<ReturnType<typeof getOkr>>>;
export type GetOkrQueryError = ErrorType<void>;
/**
 * @summary Obter OKR por ID
 */
export declare function useGetOkr<TData = Awaited<ReturnType<typeof getOkr>>, TError = ErrorType<void>>(id: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getOkr>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getUpdateOkrUrl: (id: number) => string;
/**
 * @summary Atualizar OKR
 */
export declare const updateOkr: (id: number, okrUpdate: OkrUpdate, options?: RequestInit) => Promise<Okr>;
export declare const getUpdateOkrMutationOptions: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateOkr>>, TError, {
        id: number;
        data: BodyType<OkrUpdate>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof updateOkr>>, TError, {
    id: number;
    data: BodyType<OkrUpdate>;
}, TContext>;
export type UpdateOkrMutationResult = NonNullable<Awaited<ReturnType<typeof updateOkr>>>;
export type UpdateOkrMutationBody = BodyType<OkrUpdate>;
export type UpdateOkrMutationError = ErrorType<void>;
/**
* @summary Atualizar OKR
*/
export declare const useUpdateOkr: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateOkr>>, TError, {
        id: number;
        data: BodyType<OkrUpdate>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof updateOkr>>, TError, {
    id: number;
    data: BodyType<OkrUpdate>;
}, TContext>;
export declare const getDeleteOkrUrl: (id: number) => string;
/**
 * @summary Remover OKR
 */
export declare const deleteOkr: (id: number, options?: RequestInit) => Promise<void>;
export declare const getDeleteOkrMutationOptions: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteOkr>>, TError, {
        id: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof deleteOkr>>, TError, {
    id: number;
}, TContext>;
export type DeleteOkrMutationResult = NonNullable<Awaited<ReturnType<typeof deleteOkr>>>;
export type DeleteOkrMutationError = ErrorType<void>;
/**
* @summary Remover OKR
*/
export declare const useDeleteOkr: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteOkr>>, TError, {
        id: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof deleteOkr>>, TError, {
    id: number;
}, TContext>;
export declare const getCreateKeyResultUrl: (id: number) => string;
/**
 * @summary Adicionar Key Result a um OKR
 */
export declare const createKeyResult: (id: number, keyResultInput: KeyResultInput, options?: RequestInit) => Promise<KeyResult>;
export declare const getCreateKeyResultMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createKeyResult>>, TError, {
        id: number;
        data: BodyType<KeyResultInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof createKeyResult>>, TError, {
    id: number;
    data: BodyType<KeyResultInput>;
}, TContext>;
export type CreateKeyResultMutationResult = NonNullable<Awaited<ReturnType<typeof createKeyResult>>>;
export type CreateKeyResultMutationBody = BodyType<KeyResultInput>;
export type CreateKeyResultMutationError = ErrorType<unknown>;
/**
* @summary Adicionar Key Result a um OKR
*/
export declare const useCreateKeyResult: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createKeyResult>>, TError, {
        id: number;
        data: BodyType<KeyResultInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof createKeyResult>>, TError, {
    id: number;
    data: BodyType<KeyResultInput>;
}, TContext>;
export declare const getUpdateKeyResultUrl: (id: number) => string;
/**
 * @summary Atualizar Key Result
 */
export declare const updateKeyResult: (id: number, keyResultUpdate: KeyResultUpdate, options?: RequestInit) => Promise<KeyResult>;
export declare const getUpdateKeyResultMutationOptions: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateKeyResult>>, TError, {
        id: number;
        data: BodyType<KeyResultUpdate>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof updateKeyResult>>, TError, {
    id: number;
    data: BodyType<KeyResultUpdate>;
}, TContext>;
export type UpdateKeyResultMutationResult = NonNullable<Awaited<ReturnType<typeof updateKeyResult>>>;
export type UpdateKeyResultMutationBody = BodyType<KeyResultUpdate>;
export type UpdateKeyResultMutationError = ErrorType<void>;
/**
* @summary Atualizar Key Result
*/
export declare const useUpdateKeyResult: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateKeyResult>>, TError, {
        id: number;
        data: BodyType<KeyResultUpdate>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof updateKeyResult>>, TError, {
    id: number;
    data: BodyType<KeyResultUpdate>;
}, TContext>;
export declare const getDeleteKeyResultUrl: (id: number) => string;
/**
 * @summary Remover Key Result
 */
export declare const deleteKeyResult: (id: number, options?: RequestInit) => Promise<void>;
export declare const getDeleteKeyResultMutationOptions: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteKeyResult>>, TError, {
        id: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof deleteKeyResult>>, TError, {
    id: number;
}, TContext>;
export type DeleteKeyResultMutationResult = NonNullable<Awaited<ReturnType<typeof deleteKeyResult>>>;
export type DeleteKeyResultMutationError = ErrorType<void>;
/**
* @summary Remover Key Result
*/
export declare const useDeleteKeyResult: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteKeyResult>>, TError, {
        id: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof deleteKeyResult>>, TError, {
    id: number;
}, TContext>;
export declare const getListKpisUrl: () => string;
/**
 * @summary Listar KPIs
 */
export declare const listKpis: (options?: RequestInit) => Promise<Kpi[]>;
export declare const getListKpisQueryKey: () => readonly ["/api/kpis"];
export declare const getListKpisQueryOptions: <TData = Awaited<ReturnType<typeof listKpis>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listKpis>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listKpis>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListKpisQueryResult = NonNullable<Awaited<ReturnType<typeof listKpis>>>;
export type ListKpisQueryError = ErrorType<unknown>;
/**
 * @summary Listar KPIs
 */
export declare function useListKpis<TData = Awaited<ReturnType<typeof listKpis>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listKpis>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getCreateKpiUrl: () => string;
/**
 * @summary Criar novo KPI
 */
export declare const createKpi: (kpiInput: KpiInput, options?: RequestInit) => Promise<Kpi>;
export declare const getCreateKpiMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createKpi>>, TError, {
        data: BodyType<KpiInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof createKpi>>, TError, {
    data: BodyType<KpiInput>;
}, TContext>;
export type CreateKpiMutationResult = NonNullable<Awaited<ReturnType<typeof createKpi>>>;
export type CreateKpiMutationBody = BodyType<KpiInput>;
export type CreateKpiMutationError = ErrorType<unknown>;
/**
* @summary Criar novo KPI
*/
export declare const useCreateKpi: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createKpi>>, TError, {
        data: BodyType<KpiInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof createKpi>>, TError, {
    data: BodyType<KpiInput>;
}, TContext>;
export declare const getUpdateKpiUrl: (id: number) => string;
/**
 * @summary Atualizar KPI
 */
export declare const updateKpi: (id: number, kpiUpdate: KpiUpdate, options?: RequestInit) => Promise<Kpi>;
export declare const getUpdateKpiMutationOptions: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateKpi>>, TError, {
        id: number;
        data: BodyType<KpiUpdate>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof updateKpi>>, TError, {
    id: number;
    data: BodyType<KpiUpdate>;
}, TContext>;
export type UpdateKpiMutationResult = NonNullable<Awaited<ReturnType<typeof updateKpi>>>;
export type UpdateKpiMutationBody = BodyType<KpiUpdate>;
export type UpdateKpiMutationError = ErrorType<void>;
/**
* @summary Atualizar KPI
*/
export declare const useUpdateKpi: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateKpi>>, TError, {
        id: number;
        data: BodyType<KpiUpdate>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof updateKpi>>, TError, {
    id: number;
    data: BodyType<KpiUpdate>;
}, TContext>;
export declare const getDeleteKpiUrl: (id: number) => string;
/**
 * @summary Remover KPI
 */
export declare const deleteKpi: (id: number, options?: RequestInit) => Promise<void>;
export declare const getDeleteKpiMutationOptions: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteKpi>>, TError, {
        id: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof deleteKpi>>, TError, {
    id: number;
}, TContext>;
export type DeleteKpiMutationResult = NonNullable<Awaited<ReturnType<typeof deleteKpi>>>;
export type DeleteKpiMutationError = ErrorType<void>;
/**
* @summary Remover KPI
*/
export declare const useDeleteKpi: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteKpi>>, TError, {
        id: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof deleteKpi>>, TError, {
    id: number;
}, TContext>;
export declare const getGetDashboardSummaryUrl: () => string;
/**
 * @summary Resumo executivo do dashboard
 */
export declare const getDashboardSummary: (options?: RequestInit) => Promise<DashboardSummary>;
export declare const getGetDashboardSummaryQueryKey: () => readonly ["/api/dashboard/summary"];
export declare const getGetDashboardSummaryQueryOptions: <TData = Awaited<ReturnType<typeof getDashboardSummary>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getDashboardSummary>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getDashboardSummary>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetDashboardSummaryQueryResult = NonNullable<Awaited<ReturnType<typeof getDashboardSummary>>>;
export type GetDashboardSummaryQueryError = ErrorType<unknown>;
/**
 * @summary Resumo executivo do dashboard
 */
export declare function useGetDashboardSummary<TData = Awaited<ReturnType<typeof getDashboardSummary>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getDashboardSummary>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export {};
//# sourceMappingURL=api.d.ts.map