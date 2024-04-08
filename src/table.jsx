import { Header, FooterPage } from "./HAF";

function Table() {
    return (
        <div>
            {/*<Header />*/}
            <table>
                <thead id="table-header">
                    <tr>
                        <th>Table</th>
                        <th>Time</th>
                        <th>Date</th>
                        <th>Accommodation</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>table</td>
                        <td>time</td>
                        <td>date</td>
                        <td>accommodation</td>
                        <td>
                            <a href ='#' className='button'>Reserve</a>
                            <form method='POST'>
                                <input id="reserved_table" name="reserved_table" type="hidden" />
                            </form>
                        </td>
                    </tr>
                </tbody>
            </table>
            <FooterPage />
        </div>
    );
}

export default Table;
