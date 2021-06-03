import re
import json


def parse_netlog(file, match_id, user_id):
    regex = re.compile("\d\d\d\d-\d\d-\d\dT\d\d-\d\d-\d\d")

    windows = []
    incoming = [0]
    outgoing = [0]
    time = [0]

    filetext = file.read()
    filetext = filetext.decode('UTF-8')

    for line in filetext.splitlines():
        try:

            if regex.match(line):
                continue

            tokens = line.split(',')

            time.append(int(tokens[0]))
            incoming.append(int(tokens[2]))
            outgoing.append(int(tokens[3]))

            time_window = int(tokens[0])
            ping_window = int(tokens[8])
            jitter_window = int(tokens[16])

            try:
                loss_percentage_window = float(tokens[15]) * 100
            except ValueError:
                # fill in zero for -nan(ind) error in netlog
                loss_percentage_window = float(0)

            in_bandwidth_window = (incoming[-1] - incoming[-2]) / ((time[-1] - time[-2]))
            out_bandwidth_window = (outgoing[-1] - outgoing[-2]) / ((time[-1] - time[-2]))

            windows.append({
                'match_id': match_id,
                'user_id': user_id,
                'time': time_window,
                'ping': ping_window,
                'jitter': jitter_window,
                'in_bandwidth': in_bandwidth_window,
                'out_bandwidth': out_bandwidth_window,
                'loss': loss_percentage_window})

        except Exception as ex:
            print('2: ' + str(ex))

    return windows


def parse_match(match, user_id, username):
    teams = {
        'winner': [],
        'loser': [],
    }
    win = False
    try:

        for participant in match['participantIdentities']:
            participant_id = participant['participantId']
            participant_data = match['participants'][participant_id - 1]
            participant_to_save = {
                'name': participant['player']['summonerName'],
                'champion': participant_data['championId'],
                'profile_icon_id': participant['player']['profileIcon'],
                'id': participant['participantId'],
                'role': participant_data['timeline']['role'],
                'lane': participant_data['timeline']['lane'],
                'kills': participant_data['stats']['kills'],
                'deaths': participant_data['stats']['deaths'],
                'assists': participant_data['stats']['assists'],
                'total_dmg': participant_data['stats']['totalDamageDealt'],
                'total_damage_taken': participant_data['stats']['totalDamageDealt'],
                'gold_earned': participant_data['stats']['goldEarned'],
            }

            if participant_data['stats']['win']:
                teams['winner'].append(participant_to_save)
            else:
                teams['loser'].append(participant_to_save)

            if str(participant_to_save['name']).casefold() == str(username).casefold():
                win = participant_data['stats']['win']

        match_to_save = {
            'user_id': user_id,
            'match_id': match['gameId'],
            'queue_id': match['queueId'],
            'game_type': match['gameType'],
            'game_duration': match['gameDuration'],
            'game_start': match['gameCreation'],
            'platform_id': match['platformId'],
            'season_id': match['seasonId'],
            'map_id': match['mapId'],
            'game_mode': match['gameMode'],
            'teams': json.dumps(teams),
            'won': win
        }

        return match_to_save

    except Exception as ex:
        print('1: ' + str(ex))
        return False


def parse_event(event, pov_id, match_id, events, user_id):
    if event['type'] == 'CHAMPION_KILL':
        if (event['killerId'] == pov_id or event['victimId'] == pov_id):
            type = 'CHAMPION_KILL' if event['killerId'] == pov_id else 'CHAMPION_DEATH'
            events.append({
                "match_id": match_id,
                "user_id": user_id,
                "timestamp": event['timestamp'],
                "x": event['position']['x'],
                "y": event['position']['y'],
                "active_participant": event['killerId'],
                "passive_participant": event['victimId'],
                "assisting_participants": event['assistingParticipantIds'],
                "type": type,
            })
    elif event['type'] == 'WARD_PLACED':
        if (event['creatorId'] == pov_id):
            events.append({
                "match_id": match_id,
                "user_id": user_id,
                "timestamp": event['timestamp'],
                "x": 0,
                "y": 0,
                "active_participant": event['creatorId'],
                "passive_participant": '',
                "assisting_participants": [],
                "type": event['type'],
            })
    elif event['type'] == 'WARD_KILL':
        if event['killerId'] == pov_id:
            events.append({
                "match_id": match_id,
                "user_id": user_id,
                "timestamp": event['timestamp'],
                "x": 0,
                "y": 0,
                "active_participant": event['killerId'],
                "passive_participant": '',
                "assisting_participants": [],
                "type": event['type'],
            })
    elif event['type'] == 'BUILDING_KILL':
        if event['killerId'] == pov_id:
            events.append({
                "match_id": match_id,
                "user_id": user_id,
                "timestamp": event['timestamp'],
                "x": event['position']['x'],
                "y": event['position']['y'],
                "active_participant": event['killerId'],
                "passive_participant": event['buildingType'],
                "assisting_participants": event['assistingParticipantIds'],
                "type": event['type'],
            })
    elif event['type'] == 'ELITE_MONSTER_KILL':
        if event['killerId'] == pov_id:
            events.append({
                "match_id": match_id,
                "user_id": user_id,
                "timestamp": event['timestamp'],
                "x": event['position']['x'],
                "y": event['position']['y'],
                "active_participant": event['killerId'],
                "passive_participant": event['monsterType'],
                "assisting_participants": [],
                "type": event['type'],
            })
    elif event['type'] == 'ITEM_PURCHASED':
        if event['participantId'] == pov_id:
            events.append({
                "match_id": match_id,
                "user_id": user_id,
                "timestamp": event['timestamp'],
                "x": 0,
                "y": 0,
                "active_participant": event['participantId'],
                "passive_participant": event['itemId'],
                "assisting_participants": [],
                "type": event['type'],
            })
    elif event['type'] == 'ITEM_SOLD':
        if event['participantId'] == pov_id:
            events.append({
                "match_id": match_id,
                "user_id": user_id,
                "timestamp": event['timestamp'],
                "x": 0,
                "y": 0,
                "active_participant": event['participantId'],
                "passive_participant": event['itemId'],
                "assisting_participants": [],
                "type": event['type'],
            })
    elif event['type'] == 'ITEM_DESTROYED':
        if event['participantId'] == pov_id:
            events.append({
                "match_id": match_id,
                "user_id": user_id,
                "timestamp": event['timestamp'],
                "x": 0,
                "y": 0,
                "active_participant": event['participantId'],
                "passive_participant": event['itemId'],
                "assisting_participants": [],
                "type": event['type'],
            })
    elif event['type'] == 'ITEM_UNDO':
        if event['participantId'] == pov_id:
            events.append({
                "match_id": match_id,
                "user_id": user_id,
                "timestamp": event['timestamp'],
                "x": 0,
                "y": 0,
                "active_participant": event['participantId'],
                "passive_participant": '',
                "assisting_participants": [],
                "type": event['type'],
            })
    elif event['type'] == 'SKILL_LEVEL_UP':
        if event['participantId'] == pov_id:
            events.append({
                "match_id": match_id,
                "user_id": user_id,
                "timestamp": event['timestamp'],
                "x": 0,
                "y": 0,
                "active_participant": event['participantId'],
                "passive_participant": '',
                "assisting_participants": [],
                "type": event['type'],
            })
    elif event['type'] == 'ASCENDED_EVENT':
        if event['participantId'] == pov_id or event['killerId'] == pov_id:
            events.append({
                "match_id": match_id,
                "user_id": user_id,
                "timestamp": event['timestamp'],
                "x": 0,
                "y": 0,
                "active_participant": event['participantId'],
                "passive_participant": '',
                "assisting_participants": [],
                "type": event['type'],
            })
    elif event['type'] == 'CAPTURE_POINT':
        if event['participantId'] == pov_id or event['killerId'] == pov_id:
            events.append({
                "match_id": match_id,
                "user_id": user_id,
                "timestamp": event['timestamp'],
                "x": 0,
                "y": 0,
                "active_participant": event['participantId'],
                "passive_participant": '',
                "assisting_participants": [],
                "type": event['type'],
            })
    elif event['type'] == 'PORO_KING_SUMMON':
        if event['participantId'] == pov_id or event['killerId'] == pov_id:
            events.append({
                "match_id": match_id,
                "user_id": user_id,
                "timestamp": event['timestamp'],
                "x": 0,
                "y": 0,
                "active_participant": event['participantId'],
                "passive_participant": '',
                "assisting_participants": [],
                "type": event['type'],
            })


def parse_timeline(timeline, log_owner_id, match_id, user_id):
    events = []
    frames = []
    for frame in timeline['frames']:
        try:
            owner_frame = frame['participantFrames'][str(log_owner_id)]
            frames.append({
                'user_id': user_id,
                'match_id': match_id,
                'timestamp': frame['timestamp'],
                'exp': owner_frame['xp'],
                'gold': owner_frame['totalGold'],
                'creep_score': owner_frame['minionsKilled'],
                'neutral_score': owner_frame['jungleMinionsKilled'],
                'level': owner_frame['level'],
            })

            for event in frame['events']:
                parse_event(event, log_owner_id, match_id, events, user_id)
        except Exception as ex:
            print('3: ' + str(ex))

    return frames, events

# def safeAssign(current_object, keys):
#     for i in range(0, len(keys)):
#         if current_object is not None and hasattr(current_object, keys[i]):
#             print('get attr ' + keys[i] + 'from ' + str(current_object))
#             current_object = getattr(current_object, keys[i])
#             print('gottem')
#         else:
#             print(str(current_object) + ' has no attr ' + keys[i])
#             return ''
#     return current_object
