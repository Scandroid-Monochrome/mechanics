import { Injectable } from "@angular/core";
import { Frontier, Frontiers, State } from "./magic15.model";
import * as _ from "lodash";

@Injectable({ providedIn: 'root'})
export class Magic15Service {
  solve(state: State) {
    const frontiers = new Frontiers([new Frontier([state])]);
    
    while (true) {
      const frontier = frontiers.lastFrontier();

      const solutions = frontier?.solutions() ?? [];
      if (!_.isEmpty(solutions)) {
        console.log(`Found solutions: ${solutions}`);
        return solutions[0];
      }
  
      frontiers.addNextFrontier();
    }
  }
}
