using Elastic.Clients.Elasticsearch;
using ReactApp1.Server.Data.Models;

namespace ReactApp1.Server.Services
{
    public class SearchService
    {
        private readonly ElasticsearchClient _client;

        public SearchService(ElasticsearchClient client)
        {
            _client = client;
        }

        public async Task IndexDoctorAsync(Mjeku doctor)
        {
            var response = await _client.IndexAsync(doctor, i => i.Index("doctors-index"));
            
            if (!response.IsSuccess())
            {
                // Handle error
                Console.WriteLine($"Failed to index document: {response.DebugInformation}");
            }
        }

        public async Task<List<Mjeku>> SearchDoctorsAsync(string query)
        {
            var searchResponse = await _client.SearchAsync<Mjeku>(s => s
                .Indices("doctors-index")
                .Query(q => q
                    .MultiMatch(m => m
                        .Query(query)
                        .Fields(new[] { "emri", "mbiemri", "specializimi" })
                        .Fuzziness(new Fuzziness("AUTO"))
                    )
                )
            );

            return searchResponse.Documents.ToList();
        }
    }
}
