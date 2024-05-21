import { createFileRoute } from '@tanstack/react-router'
import { getCompagny } from '../../WebServices/API/companies';

export const Route = createFileRoute('/c/$company_id')({
  component: Compagny,
})

function Compagny (){
  const {company_id} = Route.useParams();
  return <div> Hello Compagny {company_id}</div>
}