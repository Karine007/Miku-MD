# Writes script_long.json (11 chapters) + anchors_long.json (scene id -> first words) for the FTX and WeWork long-form episodes.
import json, sys
FTX = [
("hook", [
("h_worth", "In twenty twenty-two, a thirty year old was worth twenty-six billion dollars, on paper."),
("h_shorts", "He wore shorts and a T-shirt, played video games during investor meetings, and slept on a beanbag at the office."),
("n_famous", "He shared the stage with former presidents and superstars."),
("n_vanish", "Then, in just one week, his empire collapsed, and about eight billion dollars of customer money was gone."),
("h_title", "So how did a guy in shorts make billions disappear? This is the story of FTX.")]),
("sam", [
("n_parents", "Sam Bankman-Fried grew up in California. Both of his parents were law professors at Stanford. He was a math whiz who found school boring."),
("b_mit", "He studied physics at MIT, then joined a Wall Street trading firm."),
("n_give", "He said he had one big goal: make as much money as possible, and then give it all away.")]),
("alameda", [
("b_alameda", "In twenty seventeen, he started his own crypto trading firm, called Alameda Research."),
("n_japan", "He noticed that bitcoin cost more in Japan than in America. Buy cheap here, sell high there. He made millions."),
("b_ftx", "Then, in twenty nineteen, he launched FTX, an exchange where millions of people could buy and sell crypto."),
("n_bahamas", "He moved the company to the Bahamas, and lived in a luxury penthouse with his closest colleagues.")]),
("rise", [
("g_fast", "FTX grew incredibly fast."),
("g_arena", "It paid one hundred thirty-five million dollars to put its name on the Miami Heat's arena."),
("g_bowl", "It ran a Super Bowl ad with Larry David."),
("g_stars", "Tom Brady, Gisele, and Steph Curry all promoted it."),
("n_congress", "Sam testified in front of Congress, and gave tens of millions of dollars to politicians."),
("g_32", "By early twenty twenty-two, investors valued FTX at thirty-two billion dollars."),
("g_buffett", "Magazines called him the next Warren Buffett."),
("x_secret", "But behind the scenes, there was a secret.")]),
("secret", [
("n_two", "FTX and Alameda were supposed to be completely separate companies."),
("n_backdoor", "But Alameda had a special privilege. It could borrow almost unlimited money from FTX, and nobody outside knew."),
("n_bets", "And when crypto prices crashed in twenty twenty-two, Alameda was losing billions.")]),
("collapse", [
("c_leak", "On November second, twenty twenty-two, a news site called CoinDesk published a leaked balance sheet from Alameda."),
("c_ftt", "Much of it was made of FTT, a token that FTX had created itself."),
("c_ask", "People started asking: is the money really there?"),
("c_cz", "Four days later, Changpeng Zhao, the boss of the rival exchange Binance, announced he would sell all his FTT tokens."),
("c_panic", "Panic."),
("c_run", "Customers rushed to pull out their money. About six billion dollars, in just seventy-two hours."),
("n_tweet", "Sam tweeted: FTX is fine. Assets are fine. He deleted it the next day.")]),
("bankrupt", [
("c_froze", "FTX could not pay. It froze withdrawals."),
("c_binance", "Binance offered to buy FTX, looked at the books, and walked away the next day."),
("c_bankrupt", "On November eleventh, FTX filed for bankruptcy, and Sam resigned."),
("c_week", "His fortune went from billions to almost nothing, in about a week.")]),
("mess", [
("n_ray", "The man brought in to clean up the mess was John Ray, who had also cleaned up after Enron."),
("n_quote", "Even he said he had never seen such a complete failure of corporate controls."),
("n_chaos", "Expenses were approved with emoji in group chats. There were no proper records of who owned what."),
("m_where", "So where did the money go?"),
("m_sent", "Prosecutors said customer money deposited at FTX had secretly been sent to Alameda,"),
("m_used", "and used for risky trades, investments, political donations, and real estate in the Bahamas."),
("m_missing", "About eight billion dollars of customer money was missing.")]),
("trial", [
("a_arrest", "In December twenty twenty-two, Sam was arrested in the Bahamas and flown to the United States."),
("n_house", "He was released on a two hundred fifty million dollar bond, and lived at his parents' house."),
("n_jail", "But a judge sent him to jail before the trial, for trying to influence a witness."),
("a_friends", "At the trial, his closest colleagues, including Alameda's boss Caroline Ellison, testified against him."),
("n_stand", "Sam took the stand himself. Again and again, he said he could not remember.")]),
("verdict", [
("a_guilty", "In November twenty twenty-three, the jury found him guilty on all seven counts, after just a few hours."),
("a_25", "In March twenty twenty-four, he was sentenced to twenty-five years in prison."),
("n_repay", "And the customers? Years later, most were told they would get back more than they had lost, in dollars."),
("n_btc", "But crypto had soared since then. Many of them would have been far richer, if they had never trusted FTX.")]),
("end", [
("a_from", "From the next Warren Buffett, to a prison cell."),
("a_end", "Rise... and ruin. This was FTX."),
("e_sub", "Subscribe for more stories of rise and ruin.")]),
]
WW = [
("hook", [
("h_worth", "In twenty nineteen, one office company was worth forty-seven billion dollars."),
("h_rent", "It didn't invent anything. It rented desks."),
("n_tequila", "Its founder handed out tequila shots at meetings, flew a sixty million dollar private jet, and said he wanted to be the world's first trillionaire."),
("n_crash", "Four years later, the company was bankrupt."),
("h_title", "So how did a company that rented desks convince the world it was worth billions? This is the story of WeWork.")]),
("adam", [
("n_kibbutz", "Adam Neumann grew up in Israel. Part of his childhood was spent on a kibbutz, a farm community where everyone shares everything. Years later, that idea of sharing would make him rich."),
("n_navy", "He served in the navy, and moved to New York at twenty-two."),
("n_krawlers", "One of his first ideas was baby clothes with knee pads. It flopped."),
("b_open", "Then, in twenty ten, Adam and his partner Miguel McKelvey opened their first shared office in New York.")]),
("idea", [
("b_idea", "The idea was simple: take a long lease on a building,"),
("b_glass", "fill it with glass walls, beer on tap and free coffee,"),
("b_month", "then rent the desks out, month by month."),
("n_risk", "But there was a catch. WeWork promised to pay rent for fifteen years. Its members could leave after one month.")]),
("dream", [
("d_dream", "Adam didn't sell desks. He sold a dream."),
("d_consc", "WeWork was a community, he said, with a mission to elevate the world's consciousness."),
("n_camp", "Every summer, it threw a giant camp for its staff, with concerts, and parties until dawn."),
("n_barefoot", "Adam walked around barefoot, went surfing with his team, and even banned meat at company events.")]),
("money", [
("i_love", "Investors loved it."),
("i_son", "Then SoftBank's boss, Masayoshi Son, toured the office for just twelve minutes, and agreed to invest billions."),
("n_crazier", "He told Adam to think bigger, and to be even crazier."),
("g_spread", "WeWork spread to hundreds of buildings in dozens of countries."),
("n_we", "It launched WeLive apartments, a school called WeGrow, and even invested in a wave pool company."),
("g_47", "And by early twenty nineteen, it was valued at forty-seven billion dollars.")]),
("problem", [
("n_jet", "Adam bought a private jet and several homes, and borrowed hundreds of millions of dollars against his shares."),
("x_problem", "There was just one problem."),
("x_money", "It was losing money. A lot of money.")]),
("ipo", [
("f_file", "In August twenty nineteen, WeWork filed to go public,"),
("f_numbers", "and for the first time, everyone could see the numbers."),
("f_loss", "The year before, it had lost about one point nine billion dollars."),
("n_hour", "That's more than two hundred thousand dollars, every single hour."),
("f_strange", "The filing also showed something strange."),
("f_lease", "Adam owned stakes in buildings that he leased back to WeWork."),
("f_we", "And a company he controlled had trademarked the word We,"),
("f_paid", "and WeWork paid it nearly six million dollars for it. He later gave that money back."),
("n_rebekah", "And if Adam died, his wife Rebekah would help choose the next boss.")]),
("fall", [
("p_panic", "Investors panicked."),
("p_melt", "The forty-seven billion dollar valuation started to melt. Talk dropped to twenty billion, then even lower."),
("n_wsj", "Then the Wall Street Journal published wild stories about Adam's partying, on the ground and on his jet."),
("p_down", "In September, Adam stepped down as CEO,"),
("p_cancel", "and the IPO was cancelled."),
("p_rescue", "SoftBank rescued the company,"),
("p_exit", "and Adam left with a package reported at over a billion dollars.")]),
("ruin", [
("r_again", "After the failed IPO, WeWork tried to start again."),
("r_jobs", "Thousands of jobs were cut."),
("r_covid", "Then, in twenty twenty, the pandemic hit, and offices around the world went empty.")]),
("collapse", [
("r_spac", "In twenty twenty-one, WeWork finally went public anyway, through a deal valuing it at about nine billion dollars,"),
("r_fifth", "less than a fifth of its old price."),
("r_leases", "But the leases were still there. Long, expensive leases on buildings that people no longer wanted."),
("r_shares", "The shares kept falling, down more than ninety-nine percent."),
("r_bankrupt", "In November twenty twenty-three, WeWork filed for bankruptcy."),
("r_once", "A company once worth forty-seven billion dollars.")]),
("end", [
("n_flow", "And Adam? He was still a billionaire. In twenty twenty-two, one of Silicon Valley's biggest investors put three hundred fifty million dollars into his next company, an apartment business called Flow."),
("n_lesson", "Investors had paid for a dream. In the end, it was still just desks."),
("r_end", "Rise... and ruin. This was WeWork."),
("e_sub", "Subscribe for more stories of rise and ruin.")]),
]
for name, S in [('ftx', FTX), ('wework', WW)]:
    assert len(S) == 11
    script = [[c, ' '.join(t for _, t in segs)] for c, segs in S]
    anchors = [[sid, ' '.join(t.split()[:4]) if len(t.split()) > 4 else t] for c, segs in S for sid, t in segs]
    ids = [a[0] for a in anchors]; assert len(ids) == len(set(ids)), name
    json.dump(script, open(f'../{name}/script_long.json', 'w'), indent=0)
    json.dump(anchors, open(f'../{name}/anchors_long.json', 'w'), indent=0)
    print(name, sum(len(s[1].split()) for s in script), 'words', len(anchors), 'scenes', [len(s[1].split()) for s in script])
