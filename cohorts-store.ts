import { StoreApi, UseBoundStore, create,  } from 'zustand';
import { CohortCard, CohortsStore, ICohortProvider } from '../components/types';



export const useCohorts: UseBoundStore<StoreApi<CohortsStore>> = create<CohortsStore>((set) => ({
    CohortCards:[],
    setCohortCards: (cohortCards: CohortCard[]) => set({ CohortCards: cohortCards }),
    appendCohortCards: (cohortCards: CohortCard[]) =>
        set((state) => ({ CohortCards: [...state.CohortCards, ...cohortCards] })),
}))


export class CohortProvider implements ICohortProvider{
    public CohortProvider(){

    }
    private setCohortCards = useCohorts((state: { setCohortCards: any; }) => state.setCohortCards)
    private appendCohortCards = useCohorts((state: { appendCohortCards: any; }) => state.appendCohortCards)

    public async fetch_cohorts(event_log: string, k: Number, alpha: Number, max_cohorts: Number, phi: Number, signal:any ){
        
        
        const url = `http://127.0.0.1:5000/v1/cohorts?k=${k}&alpha=${alpha}&max_cohorts=${max_cohorts}&phi=${phi}&event_log=${event_log}`;
        
        try{
            const response = await fetch(url, {signal: signal});
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            
            const transformedData = data.map((item: any) => ({
            id: item.id,
            title: item.title,
            graph: {
                nodes: item.graph.nodes.map((node: any) => ({ id: node.id, label: node.label, level: node.level })),
                edges: item.graph.edges.map((edge: any) => ({ id: edge.id, from: edge.from, to: edge.to, freq: edge.value, label: edge.value.toString()}))
            },
            average: item.avg_duration,
            median: item.median_duration,
            number_traces: item.number_traces 
            }));
            // cohorts.cohort_array is a global storage for cohorts. 
            this.setCohortCards(transformedData);
            return;
        }catch(error){
            throw new Error('Aborted');
            
        }
        
    }
}